var _     = require('underscore');
var Deal = require('/models/deal');
var Basket = require('/models/basket');
var Product = require('/models/product');
var util  = {};
// var exports = module.exports;

util.checkCurrentDeals = function (basketID) {
    Basket.findById(basketID, function(err, basket){
        if(err)
            console.log(err);        
        
        var basket_items = basket.items;
        var deals = [];
        
        // for each item in the basket
        _.each(basket_items, function(b_item){ 
            // find the product from the ID
            Product.findById(b_item.productID, function(err, product){
                // for each product, check & grab their attached deals
                _.each(product.attachedDealIDs, function(err, dealID){
                       Deal.findById(dealID, function(deal){
                           deals.push(deal);
                       });
                });
            });
        });
        
        // Get rid of dupes
        deals = _.uniq(deals);
        
        // GOT THE DEALS AT THIS POINT
        // COMPARE IF THEY HAVE THE CORRECT AMOUNT FOR THE DEALS
        
        // for each item in the basket
        _.each(basket_items, function(b_item){
            // for each deal (that have been filtered for just the relevant deals)
            _.each(deals, function(deal){
                // check if the deal contains the current item product
                if(_.contains(deal.conditionalItems, b_item.productID)){
                    // check if the basket contains the affectedItem that gets the discount
                    if(_.contains(basket_items, deal.affectedItemID)){
                        
                        var con_item = _.findWhere(deal.conditionalItems, {itemID: b_item.productID});
                        var affectedItem = Product.findById(deal.affectedItemID, function(err, item){ return item; });

                        // if it does check how much of the item is needed for the deal
                        // check if the quantity in the basket is divisible by the quantity needed by the deal
                        // if it is, work out the amount of affected items that get discounted 

                        var amountDiscount = b_item.quantity / con_item.quantity;

                        if(amountDiscount >= 1){
                            if(amountDiscount == 1)
                                basket.discountedAmount += deal.percentageDiscounted * affectedItem.price;
                        }
                    }
                }
            });
        });
        
        basket.save(function(err){
            if(err)
                console.log(err);
            else
                console.log("basket updated with discounted amount");
        });
    
    
    });
}

module.exports = util;