'use strict';

var mongoose            = require('mongoose');
var Schema              = mongoose.Schema;
var products = require('./product').schema;

var BasketSchema = new Schema({
    items: [{
        productID: String,
        quantity: Number        
    }],
    basketUserID: String,
    price: { // price
        type: Number,
        default: 0
    },
    discountedAmount: { // Discounted Amount
        type: Number,
        default: 0
    }  
});

module.exports  = mongoose.model('Basket', BasketSchema);