'use strict';

const MessageHandler = require('../Handler/MessageHandler');

module.exports = {
    "handler.message": { module: MessageHandler, args: ['@logger', '@client', '@listener.message', '%name%'] }
}