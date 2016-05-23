'use strict';

const AbstractModule = require('../../AbstractModule');

class CoreModule extends AbstractModule {
    get commandsDir() { return __dirname + '/Command'; }
    get hasRoutes() { return true; }
    get routesDir() { return __dirname + '/Route'; }
}

module.exports = CoreModule;