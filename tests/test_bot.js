'use strict';

const Bot = require('../src/').Bot;

try {
    let config = require('../config.json');
    let options = {
        admin_id: config.admin_id,
        token: config.auth.token,
        prefix: '!',
        modules: []
    }

    new Bot('dev', true, options);
} catch (e) {
    console.log(e);
}