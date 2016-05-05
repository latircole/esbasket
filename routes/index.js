var express = require('express');
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

/* GET home page. */
router.get('/', function(req, res, next) {
    Product.find(function(err, products){
        if(err)
            res.send(err);
        
        res.render('index', { title: 'Products', items: products });
    });
});

module.exports = router;
