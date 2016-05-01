'use strict';

const _ = require('lodash'),
      moment = require('moment'),
      prettyjson = require('prettyjson'),
      MAX_MESSAGE_LENGTH = 2000,
      MAX_MESSAGE_COUNT = 10;

class AbstractCommand {
    static get name() {
        throw new Error("Command must override the name");
    }

    static get description() {
        throw new Error("Command must override the description");
    }

    static get help() {
        return "None";
    }

    static get noHelp() {
        return false;
    }

    get server() {
        return this.message.channel.server || false;
    }

    get channel() {
        return this.message.channel || false;
    }

    get time() {
        return moment(this.message.timestamp).format('HH:mm:ss');
    }

    get author() {
        return this.message.author;
    }

    get botMention() {
        return this.rawContent.indexOf(this.prefix) === 0 || this.message.isMentioned(this.client.user);
    }

    get rawContent() {
        return this.message.content;
    }

    get content() {
        let regex = new RegExp(`^(${this.client.user.mention()})|(\\${this.prefix})`);
        return _.trim(this.rawContent.replace(regex, ''));
    }

    get mentions() {
        let users = [];

        for (let mention of this.message.mentions) {
            if (mention.id !== undefined && mention.username !== undefined) {
                users.push({ id: mention.id, name: mention.username, mention: mention.mention });
            }
        }

        return users;
    }

    constructor(container, message) {
        if (this.constructor === AbstractCommand) {
            throw new Error('Cannot instantiate AbstractCommand!');
        }

        this.container = container;
        this.message = message;

        this.prefix = container.getParameter('prefix');
        this.logger = container.get('logger');
        this.client = container.get('client');

        this.initialize();
    }

    initialize() { }

    isAdmin() {
        return this.author.id == this.client.admin.id;
    }

    sendMessage(location, message) {
        return new Promise((resolve, reject) => {
            if (message.length > MAX_MESSAGE_LENGTH * MAX_MESSAGE_COUNT) {
                reject(this.logger.error("Message is to long, rejecting..."));
            }

            this.client.sendMessage(location, message)
                .catch(reject)
                .then(resolve);
        });
    }

    reply(message, mention) {
        if (mention) message = this.author.mention() + ', ' + message;

        return this.sendMessage(this.message, message);
    }

    handle() {
        throw Error("Commands must override the handle function!");
    }

    getMatches(content, regex, callback) {
        let matches = regex.exec(content);

        if (matches === null) {
            return false;
        }

        let result = callback(matches);

        if (result !== false) {
            let array = {
                Command: {
                    time: this.time,
                    author: this.author.username,
                    server: this.server ? this.server.name : 'dm',
                    channel: this.channel ? this.channel.name : 'dm',
                    content: this.content,
                    botMention: this.botMention,
                    regex: regex.toString(),
                    matches: matches,
                    mentions: this.mentions
                }
            };

            this.logger.debug("\n" + prettyjson.render(array));
        }
    }

    matches(regex, callback) {
        if (!this.botMention) {
            return;
        }

        return this.getMatches(this.content, regex, callback);
    }
}

module.exports = AbstractCommand;