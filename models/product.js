'use strict';

var mongoose            = require('mongoose');
var Schema              = mongoose.Schema;

var ProductSchema = new Schema({
    name: { // Name  
        type: String,
        required: true
    },
    image: { // Image
        type: String,
        default: "noimage.jpeg"
    },
    description: String, // Description
    price: { // Price
        type: Number,
        default: 1
    },
    attachedDealIDs: [String],
    isDeleted: { // Is Deleted
        type: Boolean,
        default: false
    }
});

module.exports  = mongoose.model('Product', ProductSchema);