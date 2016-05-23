'use strict';
const AbstractCommand = require('../../../AbstractCommand'),
      User = require('../../../Model/User'),
      Role = require('../../../Model/Role');

class PermissionCommand extends AbstractCommand {
    static get name() {
        return 'permission';
    }

    static get description() {
        return "Manages permissions of the bot";
    }

    static get help() {
        return '//TODO';
    }

    static get adminCommand() {
        return true;
    }

    handle() {
        if (!this.isAdmin()) {
            return false;
        }

        this.matches(/^permission create ([\w\d_\-\s]+)$/g, matches => {
            let name = matches[1];
                //desc = matches[2];

            if (name.indexOf(' ') >= 0 || name.indexOf("\t") >= 0) {
                return this.reply("A role name cannot have a whitespace in them.");
            }

            Role.findOne({ name: name }).then(role => {
                if (role) {
                    return this.reply("I believe that role already exists.", true);
                }

                Role.create({ name: name }).then(role => {
                    return this.reply(`Successfully created the role **${name}**`);
                }).catch(this.logger.error);
            }).catch(this.logger.error);

            /*User.find({ _id: this.author.id }).then(user => {
                if (user) {
                    Role.find({ 'user._id': user._id }).then(role => {

                    });
                }
            }).catch(this.logger.error);*/
        });

        this.matches(/^permission remove ([\w\d_\-\s]+)$/g, matches => {
            let name = matches[1];

            Role.findOne({ name: name }).then(role => {
                console.log(role);
                if (!role) {
                    return this.reply("I believe that role doesn't exists.", true);
                }

                Role.remove({ name: name }).then(() => {
                    return this.reply(`Successfully removed the role **${name}**`);
                }).catch(this.logger.error);
            }).catch(this.logger.error);
        });
    }
}

module.exports = PermissionCommand;