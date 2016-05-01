'use strict';

class MessageHandler {
    constructor(logger, client, listener, name) {
        this.logger = logger;
        this.client = client;
        this.listener = listener;
        this.name = name;
    }

    run() {
        return new Promise((resolve, reject) => {
            this.logger.info('Message handler started');
            this.client.on('message', this.listener.handleMessage.bind(this.listener));
            resolve();
        });
    }
}

module.exports = MessageHandler;