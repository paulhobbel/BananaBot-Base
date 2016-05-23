'use strict';

const Hapi = require('hapi');

class ApiManager {
    constructor(container, logger, host, port) {
        this.container = container;
        this.logger = logger;
        this.server = new Hapi.Server();
        
        this.server.connection({
            host: host,
            port: port,
            router: {
                stripTrailingSlash: true
            },
            state: {
                strictHeader: false
            }
        });
    }
    
    installRoutes() {
        return new Promise(resolve => {
            let moduleManager = this.container.get('manager.module');
            
            let routes = moduleManager.getRoutes();
            this.logger.debug(`Loading ${routes.length} routes...`);
            this.server.route(routes);
            resolve();
        });
    }
    
    startServer() {
        this.server.start(() => {
            this.logger.info(`Api Server running at: ${this.server.info.uri}`);
        })
    }
}

module.exports = ApiManager;