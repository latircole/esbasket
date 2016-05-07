var express = require('express');
var router = express.Router();
var Cookies = require('cookies');

var _ = require('underscore');

var Product = require('./../models/product');
var Deal = require('./../models/deal');
var Basket = require('./../models/basket');

router.get('/', function(req, res){
    var cookies = new Cookies( req, res );
    var userbasketid = cookies.get("userbasketid");
        
    Basket.findOne({ basketUserID: userbasketid }, function (err, basket) {
        if (err)
            res.send(err);
        
        //might need to send product stuff aswell
        res.render('basket', { title: 'Basket', basket: basket });
    });
})

module.exports = router;