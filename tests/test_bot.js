'use strict';

const Bot = require('../src/').Bot;

try {
    let config = require('../config.json');
    let options = {
        debug: config.debug,
        admin_id: config.admin_id,
        token: config.auth.token,
        mongo_url: config.mongo_url,
        prefix: '!',
        modules: []
    }

    new Bot(options);
} catch (e) {
    console.log(e);
}