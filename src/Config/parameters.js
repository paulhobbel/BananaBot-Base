'use strict';

module.exports = (Bot) => {
    return {
        debug: Bot.options.debug,
        prefix: Bot.options.prefix,
        name: Bot.options.name,
        login: {
            token: Bot.options.token,
            email: Bot.options.email,
            password: Bot.options.password
        },
        status: Bot.options.status,
        admin_id: Bot.options.admin_id,
        commands: Bot.options.commands,
        mongo_url: Bot.options.mongo_url || null,
        log_dir: Bot.options.log_dir || null,
        loader_timeout: Bot.options.loaderTimeout,
        client_args: {
            forceFetchUsers: true
        }
    }
};