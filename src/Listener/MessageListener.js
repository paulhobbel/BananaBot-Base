'use strict';

class MessageListener {
    constructor(container, logger, moduleManager) {
        this.container = container;
        this.logger = logger;
        this.moduleManager = moduleManager;
    }

    handleMessage(message) {
        let client = this.container.get('client');

        if (message.author.id === client.user.id) {
            return false;
        }

        this.checkCommands(message, this.moduleManager.getCommands())
            .catch(this.logger.error);
    }

    checkCommands(message, commands) {
        return new Promise((resolve, reject) => {
            for (let command of commands) {
                let cmdHandler = new command(this.container, message);

                try {
                    cmdHandler.handle();
                } catch (error) {
                    this.logger.error(error.stack);
                    reject(error);
                }
            }

            resolve();
        });
    }
}

module.exports = MessageListener;