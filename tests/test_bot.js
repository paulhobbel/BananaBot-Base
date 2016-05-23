'use strict';

const Bot = require('../src/').Bot;

try {
    let config = require('../config.json');
    let options = {
        debug: config.debug,
        admin_id: config.admin_id,
        token: config.auth.token,
        mongo_url: config.mongo_url,
        
        api_host: '127.0.0.1',
        api_port: '1337',
        
        prefix: '*',
        modules: []
    }

    new Bot(options);
} catch (e) {
    console.log(e);
}