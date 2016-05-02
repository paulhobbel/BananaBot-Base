'use strict';

const MessageListener = require('../Listener/MessageListener');

module.exports = {
    "listener.message": { module: MessageListener, args: ['@container', '@logger', '@manager.module'] }
}