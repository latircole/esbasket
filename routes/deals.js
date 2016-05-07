var express = require('express');
var router = express.Router();

var _ = require('underscore');

var Product = require('./../models/product');
var Deal = require('./../models/deal');
    
router.get('/', function(req, res){
    Deal.find(function (err, deals) {
        if (err)
            res.send(err);

        res.render('deals', { title: 'Deals', deals: deals });
    });
})

// Add Deal
router.post('/add', function(req, res){
  var deal = new Deal();
    
    deal.name = req.body.name;
    deal.description = req.body.description;
    deal.conditionalItems = req.body.contentEditable
    
    var deal_items = req.body.conditionalItems;
    
    var tempItems = [];
    
    _.each(deal_items, function (dit) {
        tempItems.push({
            itemID: dit.itemID,
            quantity: dit.quantity
        });
        
        // Updating product
        Product.findById(dit.itemID, function (err, product) {
        
            var prevDealIDs = product.attachedDealIDs;
            prevDealIDs.push(deal.id);

            product.attachedDealIDs = prevDealIDs;

            product.save(function(err){
                if(err)
                    console.log(err);
                else
                    console.log("product updated with deal");
            });    
        });  
    });

    deal.conditionalItems = tempItems;
        
    deal.affectedItemID = req.body.affectedItemID;
    deal.percentageDiscounted = req.body.percentageDiscounted;
    
    deal.save(function(err){
        if(err)
            res.send(err);
        
        res.json({
            success: true,
            message: 'Deal added'
        });
        console.log('Deal added');
    });    
});


module.exports = router;