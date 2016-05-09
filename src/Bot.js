'use strict';

const _ = require('lodash'),
      chalk = require('chalk'),
      createResolver = require('options-resolver'),
      Loader = require('./Loader');

class Bot {
    constructor(options) {
        // From https://github.com/meew0/Lethe/blob/master/lethe.js#L569 (ty bud)
        process.on('uncaughtException', function (err) {
            // Handle ECONNRESETs caused by the player and fixes #1
            if (err.code == 'ECONNRESET') {
                console.log('Got an ECONNRESET! This is *probably* not an error. Stacktrace:');
                console.log(err.stack);
            } else {
                // Normal error handling
                console.log(err);
                console.log(err.stack);
                process.exit(0);
            }
        });

        let resolver = this.buildResolver();
        resolver.resolve(options)
            .then(this.buildContainer.bind(this))
            .catch(err => console.log(err.stack));
    }

    buildResolver() {
        let resolver = createResolver(),
            pkg = require('../package.json');

        resolver
            .setDefaults({
                name: pkg.name,
                version: pkg.version,
                author: pkg.author,
                debug: false,
                loaderTimeout: 60,
                container: () => {
                    return {}
                }
            })
            .setDefined([
                'status',
                'mongo_url',
                'log_dir',
                'token',
                'email',
                'password'
            ])
            .setRequired([
                'name',
                'version',
                'author',
                'debug',
                'admin_id',
                'prefix',
                'modules'
            ])
            .setAllowedTypes('name', 'string')
            .setAllowedTypes('version', 'string')
            .setAllowedTypes('author', 'string')
            .setAllowedTypes('debug', 'boolean')
            .setAllowedTypes('prefix', 'string')
            .setAllowedTypes('modules', 'array')
            .setAllowedTypes('status', 'string')
            .setAllowedTypes('admin_id', 'string')
            .setAllowedTypes('mongo_url', 'string')
            .setAllowedTypes('log_dir', 'string')
            .setAllowedTypes('token', 'string')
            .setAllowedTypes('email', 'string')
            .setAllowedTypes('password', 'string')
            .setAllowedTypes('container', 'function');

        return resolver;
    }

    buildContainer(options) {
        if (!options.token && !options.email) {
            throw new Error("Either a token or an email/password is required");
        }
        this.options = options;

        let containerAndLoader = require('./Config/Container')(this),
            loader = containerAndLoader.loader,
            builder = containerAndLoader.builder;

        loader.addJson(this.options.container(this));

        this.container = builder.build();

        this.loader = new Loader(this.container, this);
        this.run();
    }

    run() {
        this.logger = this.container.get('logger');
        this.logger.level = this.isDebug() ? 'debug' : 'info';
        this.logger.exitOnError = true;

        console.log(chalk.green(`\n\n\t${this.options.name} v${this.options.version} - by ${this.options.author}\n\n`));

        this.loader.start();

        this.loader.on('ready', this.onReady.bind(this));
    }

    onReady() {
        this.logger.info("Bot is connected, waiting for messages");
    }

    isDebug() {
        return this.options.debug;
    }
}

module.exports = Bot;