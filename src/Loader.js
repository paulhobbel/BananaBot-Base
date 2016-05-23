'use strict';

const mongoose = require('mongoose'),
      EventEmitter = require('events').EventEmitter;

class Loader extends EventEmitter {
    constructor(container, Bot) {
        super();

        this.container = container;
        this.bot = Bot;
        this.logger = container.get('logger');
        this.loaded = {
            storage: false,
            discord: false,
            modules: false,
            api: false,
            messages: false,
            presence: false
        };

        this.on('loaded', this.checkLoaded.bind(this));
        this.failCheck = setTimeout(
            this.checkLoaded.bind(this, true),
            container.getParameter('loader_timeout') * 1000
        );
    }

    start() {
        this.emit('start.pre', this);
        this.loadStorage();
        this.loadModules();
        this.emit('start.post', this);
    }

    loadStorage() {
        mongoose.connect(this.container.getParameter('mongo_url'));
        mongoose.connection.once('open', () => {
            this.setLoaded('storage');
        });
    }

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
            this.logger.info(`Loaded ${client.servers.length} servers.`);

            this.setLoaded('discord');
            client.admin = client.users.get('id', this.container.getParameter('admin_id'));

            if (this.container.getParameter('status') !== undefined) {
                client.setStatus('online', this.container.getParameter('status'));
            }

            this.container.get('handler.message').run().then(() => {
                this.setLoaded('messages');
            });

            this.container.get('handler.presence').run().then(() => {
                this.setLoaded('presence');
            });
        });

        client.on('error', this.logger.error);
        client.on('disconnected', () => this.logger.info(`Gateway closed, no way to revive it ;(`));
        if (this.container.getParameter('dev')) {
            client.on('debug', (message) => this.logger.debug(message));
        }
    }

    loadModules() {
        let moduleManager = this.container.get('manager.module');

        moduleManager.install(require('./Module/Core/CoreModule'));
        for (let module of this.bot.options.modules) {
            moduleManager.install(module);
        }

        this.setLoaded('modules');
    }
    
    loadApi() {
        let apiManager = this.container.get('manager.api');
        
        apiManager.installRoutes().then(() => {
            console.log("Hi?");
            apiManager.startServer();
            this.setLoaded('api');
        }).catch(this.logger.error);
    }

    getModuleCount() {
        return this.container.get('manager.module').getModules().length;
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
                Storage: this.loaded.storage ? 'Connected' : 'Connecting...',
                Discord: this.loaded.discord ? 'Logged In' : 'Logging In',
                Messages: this.loaded.messages ? 'Listening' : 'Starting listener',
                Presence: this.loaded.presence ? 'Listening' : 'Starting listener',
                Modules: this.loaded.modules ? this.getModuleCount() : 'Loading modules',
                API: this.loaded.api ? 'Serving' : 'Starting...',
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
        if (!this.loaded.storage) {
            return false;
        }
        
        if (this.loaded.modules && !this.loaded.api && !this.loadingApi) {
            this.loadingApi = true;
            this.loadApi();
        }

        if (this.loaded.modules && !this.loaded.discord && !this.loadingDiscord) {
            this.loadingDiscord = true;
            this.loadDiscord();
        }

        return this.loaded.discord && this.loaded.api && this.loaded.messages && this.loaded.presence;
    }
}

module.exports = Loader;