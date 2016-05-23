'use strict';

const _ = require('lodash');

class AbstractModule {
    constructor() {
        if (this.constructor === AbstractModule) {
            throw new Error('Cannot instantiate AbstractModule!');
        }
    }

    get name() {
        return this._name;
    }

    set name(value) {
        return this._name = value;
    }

    get commandsDir() {
        throw new Error('commandsDir is not extended');
    }
    
    get hasRoutes() {
        return false;
    }
    
    get routesDir() {
        throw new Error('routesDir is not extended');
    }

    getCommands() {
        if (!this.commands) {
            this.commands = _.map(require('require-all')(this.commandsDir), command => {
                //command.constructor.module = this.name;

                return command;
            });

        }

        return this.commands;
    }
    
    getRoutes() {
        if(!this.routes) {
            this.routes = _.map(require('require-all')(this.routesDir), route => {
                return {
                    method: route.method,
                    path: route.path,
                    handler: route.handler
                };
            });
        }
        
        return this.routes;
    }

    isDefaultEnabled() {
        return true;
    }
}

module.exports = AbstractModule;