'use strict';

const AbstractCommand = require('../../../AbstractCommand');

class StatsCommand extends AbstractCommand {
    static get name() {
        return 'stats';
    }

    static get description() {
        return "Shows the bot stats";
    }

    handle() {
        this.matches(/^stats$/g, () => {
            let servers = this.client.servers.length,
                channels = this.client.channels.length,
                users = this.client.users.length,
                online = this.client.users.filter(u => u.status != "offline").length;

            this.reply(`Currently joined to: ${servers} servers with ${online}/${users} members and ${channels} channels.`);

            if (this.server) {
                setTimeout(() => {
                    channels = this.server.channels.length;
                    users = this.server.members.length;
                    online = this.server.members.filter(u => u.status != "offline").length;

                    this.reply(`The current server has ${online}/${users} members and ${channels} channels.`);
                }, 500);
            }
        });

        // Anddd for our lovely TheBeast...
        this.matches(/^status$/g, () => {
            this.reply(`I'm online u deep shit u blind?`, true);
        });
    }
}

module.exports = StatsCommand;