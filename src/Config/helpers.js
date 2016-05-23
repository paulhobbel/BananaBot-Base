'use strict';

const RoleHelper = require('../Helper/RoleHelper'),
    RegexHelper = require('../Helper/RegexHelper'),
    ArrayHelper = require('../Helper/ArrayHelper');

module.exports = {
    "helper.role": {
        module: RoleHelper,
        args: ['@client']
    },
    "helper.regex": {
        module: RegexHelper
    },
    "helper.array": {
        module: ArrayHelper
    }
}