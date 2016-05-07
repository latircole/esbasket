var express = require('express');
var Cookies = require('cookies');
var router = express.Router();
var Product = require('./../models/product');
var Basket = require('./../models/basket');

// Add Product
router.post('/add', function(req, res){
  var product = new Product();
    
    product.name = req.body.name;
    product.image = req.body.image;
    product.description = req.body.description;
    product.price = req.body.price;
    
    product.save(function(err){
        if(err)
            res.send(err);
        
        res.json({
            success: true,
            message: 'Product added'
        });
        console.log('Product added');
    });    
});

router.post('/addtobasket/:product_id', function(req, res){
    var cookies = new Cookies( req, res );
    var quantityAdded = req.query.quantity;
    var userbasketid = cookies.get("userbasketid");
    console.log(quantityAdded);
    console.log(userbasketid);
    
    Basket.findOne({ basketUserID: userbasketid }, function (err, basket) {
        if(err)
            res.send(err);
        
        console.log(basket);
        
        // no basket, create a new one
        if(basket == null){
            console.log('basket created');
            basket = new Basket({
                basketUserID: userbasketid
            });
        }
        
        console.log(basket);
        
        var itemsInBasket = basket.items;
        
        // needs to check if item is already in basket
        //need to check for specific key
        //maybe findOne again?
        //if()
        
        itemsInBasket.push({
            productID: req.params.product_id,
            quantity: quantityAdded
        });
        
        basket.items = itemsInBasket;
        
        basket.save(function(err){
            if(err)
                res.send(err);
        
            res.json({
                success: true,
                message: 'Product added to basket'
            });
            console.log('Product added to basket');  
        });
             
    });
    
    
    
})

/* GET home page. */
router.get('/', function(req, res, next) {
    
    var cookies = new Cookies( req, res );
    var userbasketid = cookies.get("userbasketid");
    console.log(userbasketid);
    
    // if cookie isn't already set
    if(userbasketid == undefined){
        userbasketid = Math.random().toString(36).substring(7);
        cookies.set( "userbasketid", userbasketid, { httpOnly: false } );    
    }
    
    Product.find(function(err, products){
        if(err)
            res.send(err);
        
        res.render('index', { title: 'Products', items: products });
    });
});

module.exports = router;
