'use strict';

class PresenceHandler {
    constructor(logger, client, listener, name) {
        this.logger = logger;
        this.client = client;
        this.listener = listener;
    }

    run() {
        return new Promise((resolve, reject) => {
            this.logger.info('Presence handler started');
            this.client.on('presence', this.listener.handlePresence.bind(this.listener));
            resolve();
        });
    }
}

module.exports = PresenceHandler;