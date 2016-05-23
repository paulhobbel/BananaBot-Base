'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let User = new Schema({
    _id: {
        type: String,
        index: { unique: true }
    },
    name: String,
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }
});

module.exports = mongoose.model('User', User);
