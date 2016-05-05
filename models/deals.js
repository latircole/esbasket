'use strict';

var mongoose            = require('mongoose');
var Schema              = mongoose.Schema;
var products = require('./product').schema;

var DealSchema = new Schema({
    name: { // Name  
        type: String,
        required: true
    },
    description: String, // Description
    modified_price
        type: Number,
        default: 1
    },
    isDeleted: { // Is Deleted
        type: Boolean,
        default: false
    }
});

module.exports  = mongoose.model('Deal', DealSchema);