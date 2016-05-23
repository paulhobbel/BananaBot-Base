'use strict';

const ModuleManager = require('../Manager/ModuleManager'),
    ApiManager = require('../Manager/ApiManager');

module.exports = {
    "manager.module": {
        module: ModuleManager,
        args: ['@client']
    },
    "manager.api": {
        module: ApiManager,
        args: ['@container', '@logger', '%api.host%', '%api.port%']
    }
}