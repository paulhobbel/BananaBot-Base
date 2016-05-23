'use strict';

const User = require('../Model/User');

class PresenceListener {
    constructor(container, logger) {
        this.container = container;
        this.logger = logger;
    }

    handlePresence(olduser, newuser) {
        User.findOne({ _id: newuser.id }).then(user => {
            // Well don't know that user yet...
            if (!user) {
                User.create({ _id: newuser.id, name: newuser.username }).then(user => {
                    this.logger.debug(`Added a new user with the name ${user.name} to the database.`);
                }).catch(this.logger.error);
            }
        }).catch(this.logger.error);
    }
}

module.exports = PresenceListener;