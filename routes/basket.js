var express = require('express');
var router = express.Router();
var Cookies = require('cookies');

var _ = require('underscore');
var util = require('./../utilfunctions');

var Product = require('./../models/product');
var Deal = require('./../models/deal');
var Basket = require('./../models/basket');

router.get('/', function (req, res) {
    var cookies = new Cookies(req, res);
    var userbasketid = cookies.get("userbasketid");

    Basket.findOne({
        basketUserID: userbasketid
    }, function (err, basket) {
        if (err)
            res.send(err);

        if (basket != null) {
            Product.find(function (err, productslist) {
                var products = productslist;
                var temp = [];

                _.each(basket.items, function (b_item) {
                    temp.push(_.findWhere(productslist, {
                        'id': b_item.productID
                    }));

                });
                products = temp;

                res.render('basket', {
                    title: 'Basket',
                    basket: basket,
                    products: products
                });
            });
        } else {
            //might need to send product stuff aswell
            res.render('basket', {
                title: 'Basket'
            });
        }
    });
})

router.get('/clearbasket', function (req, res) {
    var cookies = new Cookies(req, res);
    var userbasketid = cookies.get("userbasketid");

    Basket.findOne({
        basketUserID: userbasketid
    }, function (err, basket) {
        if (err)
            res.send(err);

        basket.items = [];
        basket.discountedAmount = 0;
        basket.price = 0;
        
        basket.save(function (err) {
            if (err)
                res.send(err);

                        // update the basket price
                        util.updateBasketTotal(basket.id);

            res.render('basket', {
                title: 'Basket'
            });
            
            console.log('Basket empty');
        });

    });
})

module.exports = router;