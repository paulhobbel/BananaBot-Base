'use strict';

const AbstractModule = require('../AbstractModule');

class ModuleManager {
    constructor(client) {
        this.client = client;

        this.modules = [];
    }

    install(module) {
        if (!module instanceof AbstractModule) {
            throw new Error('Module needs to be an instance of AbstractModule.');
        }

        let m = new module();

        if (!m.name) {
            m.name = m.constructor.name.replace('Module', '').toLowerCase();
        }

        if (this.modules.find(tmpm => tmpm.name === m.name)) {
            throw new Error('There is already a module with that name.');
        }

        this.modules.push(m);
    }

    getModule(name) {
        return this.modules.find(module => module.name === name);
    }

    getCommands() {
        let commands = [];
        this.modules.forEach(module => {
            commands = commands.concat(module.getCommands());
        });

        return commands;
    }

    getModules() {
        return this.modules;
    }
}

module.exports = ModuleManager;