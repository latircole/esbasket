var express = require('express');
var Cookies = require('cookies');
var _ = require('underscore');
var util = require('./../utilfunctions');
var router = express.Router();
var Product = require('./../models/product');
var Basket = require('./../models/basket');


// Add Product
router.post('/add', function (req, res) {
    var product = new Product();

    product.name = req.body.name;
    product.image = req.body.image;
    product.description = req.body.description;
    product.price = req.body.price;

    product.save(function (err) {
        if (err)
            res.send(err);

        res.json({
            success: true,
            message: 'Product added'
        });
        console.log('Product added');
    });
});

router.get('/addtobasket/:product_id', function (req, res) {
    var cookies = new Cookies(req, res);
    var quantityAdded = req.query.quantity;
    var userbasketid = cookies.get("userbasketid");

    //check if product exists
    Product.findOne({
        '_id': req.params.product_id
    }, function (err, product) {
        if (product) {
            // check if the quantity is higher than 0    
            if (quantityAdded > 0) {

                Basket.findOne({
                    basketUserID: userbasketid
                }, function (err, basket) {
                    if (err)
                        res.send(err);

                    // no basket, create a new one
                    if (basket == null) {
                        console.log('basket created');
                        basket = new Basket({
                            basketUserID: userbasketid
                        });
                    }

                    var itemsInBasket = basket.items;

                    // needs to check if item is already in basket
                    if (_.findWhere(itemsInBasket, {
                            'productID': req.params.product_id
                        })) {
                        console.log("ID IS ALREADY IN BASKET");

                        itemsInBasket.find(function (al_item) {
                            if (al_item.productID == req.params.product_id)
                                al_item.quantity = parseInt(al_item.quantity) + parseInt(quantityAdded);
                        });

                    } else {
                        console.log("NOPE NOT IN HERE");
                        itemsInBasket.push({
                            productID: req.params.product_id,
                            quantity: quantityAdded
                        });
                    }

                    basket.items = itemsInBasket;

                    basket.save(function (err) {
                        if (err)
                            res.send(err);
                        
                        // update the basket price
                        util.updateBasketTotal(basket.id);

                        res.json({
                            success: true,
                            message: 'Product added to basket'
                        });

                        console.log('Product added to basket');
                    });
                });
            } else{
                res.json({
                            success: false,
                            message: 'quantity 0 or less'
                        });
            }
        } else{
            res.json({
                            success: false,
                            message: "product doesn't exist"
                        });
        }
    });

});

/* GET home page. */
router.get('/', function (req, res, next) {

    var cookies = new Cookies(req, res);
    var userbasketid = cookies.get("userbasketid");
    console.log(userbasketid);

    // if cookie isn't already set
    if (userbasketid == undefined) {
        userbasketid = Math.random().toString(36).substring(7);
        cookies.set("userbasketid", userbasketid, {
            httpOnly: false
        });
    }

    Product.find(function (err, products) {
        if (err)
            res.send(err);

        res.render('index', {
            title: 'Products',
            items: products
        });
    });
});

module.exports = router;