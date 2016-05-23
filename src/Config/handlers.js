'use strict';

const MessageHandler = require('../Handler/MessageHandler'),
    PresenceHandler = require('../Handler/PresenceHandler');

module.exports = {
    "handler.message": {
        module: MessageHandler,
        args: ['@logger', '@client', '@listener.message', '%name%']
    },
    "handler.presence": {
        module: PresenceHandler,
        args: ['@logger', '@client', '@listener.presence']
    }
}