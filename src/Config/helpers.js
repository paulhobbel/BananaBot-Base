'use strict';

const RoleHelper = require('../Helper/RoleHelper'),
      RegexHelper = require('../Helper/RegexHelper');

module.exports = {
    "helper.role": { module: RoleHelper, args: ['@client'] },
    "helper.regex": { module: RegexHelper }
}