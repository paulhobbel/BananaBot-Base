'use strict';

const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

let Role = new Schema({
    name: {
        type: String,
        index: { unique: true }
    },
    description: String
});

module.exports = mongoose.model('Role', Role);

