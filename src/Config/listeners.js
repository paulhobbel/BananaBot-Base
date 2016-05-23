'use strict';

const MessageListener = require('../Listener/MessageListener'),
    PresenceListener = require('../Listener/PresenceListener');

module.exports = {
    "listener.message": {
        module: MessageListener,
        args: ['@container', '@logger', '@manager.module']
    },
    "listener.presence": {
        module: PresenceListener,
        args: ['@container', '@logger']
    }
}