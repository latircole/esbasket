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
    conditionalItems: [{
        itemID: String,
        quantity: Number
    }],
    affectedItemID:  {  
        type: String,
        required: true
    },
    percentageDiscounted:  { 
        type: Number,
        required: true
    }, 
    isDeleted: { // Is Deleted
        type: Boolean,
        default: false
    }
});

module.exports  = mongoose.model('Deal', DealSchema);