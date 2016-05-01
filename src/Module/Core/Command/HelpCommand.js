'use strict';

const _ = require('lodash'),
      AbstractCommand = require('../../../AbstractCommand');

class HelpCommand extends AbstractCommand {
    static get name() {
        return 'help';
    }

    static get description() {
        return "Shows the help menu.";
    }

    static get help() {
        return "<command> - Shows the help for the given command.";
    }

    displayHelp() {
        let moduleManager = this.container.get('manager.module');

        let message = "Hello! Below you will find a list of my modules and their commands.";

        let prefix = this.prefix;
        if (prefix === '`') {
            prefix = ' `\u200B';
        }

        message += `\nAny of these commands have to be prefix with either \`${prefix}\`, or ${this.client.user.mention()}`;

        this.reply(message)
            .then(() => {
                let modules = moduleManager.getModules();

                for (let index in modules) {
                    if (modules.hasOwnProperty(index)) {
                        setTimeout(() => this.displayModuleHelp(modules[index]), 50 * index);
                    }
                }
            })
            .catch(this.logger.error);
    }

    displayModuleHelp(module) {
        let commandList = [];

        commandList = module.getCommands();

        commandList = _.orderBy(commandList, ['adminCommand', 'module', 'name'], ['asc', 'asc', 'asc']);

        let longestCommand = Math.max(...commandList.map(command => command.name.length));
        longestCommand = longestCommand > 7 ? longestCommand : 7;

        let commands = commandList.map((command) => {
            if (command.noHelp) {
                return null;
            }

            if (command.adminCommand && !this.isAdmin()) {
                return null;
            }

            return `${_.padEnd(command.name, longestCommand)}${command.adminCommand ? ' - Admin' : ''} - ${command.description}`;
        })
            .filter(line => line !== null);


        let message = `
${_.capitalize(module.name)} Module
\`\`\`
${_.padEnd('Command', longestCommand)} - Description\n
${commands.join("\n")}
\`\`\``;

        this.reply(message).catch(this.logger.error);
    }

    displayCommandHelp(name) {
        let moduleManager = this.container.get('manager.module'),
            commandList = moduleManager.getCommands();
        let command = commandList.find(command => command.name === name);
        if (command) {
            if (command.noHelp) {
                return null;
            }

            if (command.adminCommand && !this.isAdmin()) {
                return null;
            }

            this.reply(`${command.name} ${command.help}\n${command.description}`);
        }
    }


    handle() {
        this.matches(/^help$/g, () => {
            this.displayHelp();
        });

        this.matches(/^help (.+)$/, (matches) => {
            //this.displayCommandHelp(matches[1]);
        });
    }
}

module.exports = HelpCommand;