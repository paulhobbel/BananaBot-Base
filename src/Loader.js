'use strict';

const _ = require('lodash'),
      EventEmitter = require('events').EventEmitter;

class Loader extends EventEmitter {
    constructor(container, Bot) {
        super();

        this.container = container;
        this.Bot = Bot;
        this.logger = container.get('logger');
        this.loaded = {
            discord: false,
            modules: false,
            messages: false,
            extra: {}
        };

        this.on('loaded', this.checkLoaded.bind(this));
        this.failCheck = setTimeout(
            this.checkLoaded.bind(this, true),
            container.getParameter('loader_timeout') * 1000
        );
        this.printLoaded = _.throttle(this.printLoaded.bind(this), 1000);
    }

    start() {
        this.emit('start.pre', this);
        //this.loadStorage(); TODO:Find the best storage solution for this bot, maybe mongodb
        this.loadModules();
        this.emit('start.post', this);
    }

    //loadStorage() {}

    loadDiscord() {
        let data = this.container.getParameter('login'),
            client = this.container.get('client'),
            login;

        login = data.token ?
            client.loginWithToken(data.token)
            :
            client.login(data.email, data.password);

        login.catch(error => {
            this.logger.error(`There was an error while logging in: \n\n\t${error}\n`);
        });

        client.on('ready', () => {
            this.waitForNoChange(
                () => client.servers.length,
                () => {
                    this.logger.info("All servers seem to be loaded.");

                    this.setLoaded('discord');
                    client.admin = client.users.get('id', this.container.getParameter('admin_id'));

                    if (this.container.getParameter('status') !== undefined) {
                        client.setStatus('online', this.container.getParameter('status'));
                    }

                    // Handle messages here...
                    this.setLoaded('messages');
                },
                this.printLoaded.bind(this)
            );
        });

        client.on('error', this.logger.error);
        client.on('disconnected', () => this.logger.info(`Gateway closed, no way to revive it ;(`));
        if (this.container.getParameter('dev')) {
            client.on('debug', (message) => this.logger.debug(message));
        }
    }

    printLoaded() {
        let loaded = this.container.get('client').servers.length;
        this.logger.info(`Servers Loaded: ${loaded}`);
    }

    loadModules() {
        //SOMETHING SOMETHING HERE.... :P
        this.setLoaded('modules');
    }

    getModuleCount() {
        //SOMETHING SOMETHING HERE.... :P
        return 0;
    }

    checkLoaded(fail) {
        this.emit('checkLoaded');
        fail = fail !== undefined;

        if (fail) {
            throw new Error(`Failed initializing. Loaded Information: ${JSON.stringify(this.loaded)}`);
        }

        this.logger.debug({
            Status: {
                Ready: this.isLoaded() ? 'Yes' : 'No',
                Discord: this.loaded.discord ? 'Logged In' : 'Logging In',
                Messages: this.loaded.messages ? 'Listening' : 'Starting listener',
                Modules: this.loaded.modules ? this.getModuleCount() : 'Loading modules',
                Extra: this.loaded.extra
            }
        });

        if (!this.isLoaded()) {
            return false;
        }

        clearTimeout(this.failCheck);
        this.failCheck = undefined;

        setTimeout(() => {
            this.logger.debug("Finished loading. Emitting ready event");
            this.emit('ready');
        }, 1500);
    }

    setLoaded(type, subtype) {
        if (!subtype) {
            this.loaded[type] = true;
            this.emit('loaded.' + type);
        } else {
            this.loaded[type][subtype] = true;
            this.emit('loaded.' + type + '.' + subtype);
        }

        this.emit('loaded');
    }

    isLoaded() {
        for (let type in this.loaded.extra) {
            if (!this.loaded.extra.hasOwnProperty(type)) {
                continue;
            }

            if (!this.loaded.extra[type]) {
                return false;
            }
        }

        if (this.loaded.modules && !this.loaded.discord && !this.loadingDiscord) {
            this.loadingDiscord = true;
            this.loadDiscord();
        }

        return this.loaded.discord && this.loaded.messages;
    }

    waitForNoChange(item, callback, nonReadyCallback, length) {
        length = !length ? 5000 : length;
        const intervalTime = 50;
        let last = 0, time = 0;
        let interval = setInterval(() => {
            if (last === item()) {
                if (length - time <= 0) {
                    clearInterval(interval);

                    return callback();
                }

                time += intervalTime;
            } else {
                time = 0;
            }

            nonReadyCallback();
            last = item();
        }, intervalTime)
    }
}

module.exports = Loader;