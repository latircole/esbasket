'use strict';

var mongoose            = require('mongoose');
var Schema              = mongoose.Schema;
var products = require('./product').schema;

var BasketSchema = new Schema({
    items: [{
        productID: String,
        quantity: Number        
    }],
    price: Number
});

module.exports  = mongoose.model('Basket', BasketSchema);