var _ = require('underscore');
var Deal = require('./models/deal');
var Basket = require('./models/basket');
var Product = require('./models/product');
var util = {};
// var exports = module.exports;

util.checkCurrentDeals = function (basketID) {
    Basket.findById(basketID, function (err, basket) {
        if (err)
            console.log(err);

        var basket_items = basket.items;
        var deals = [];
        basket.discountedAmount = 0;

        // for each item in the basket
        _.each(basket_items, function (b_item) {
            // find the product from the ID
            Product.findById(b_item.productID, function (err, product) {
                // for each product, check if the deal's conditonal items & affected item are in the basket
                _.each(product.attachedDealIDs, function (dealID) {
                    Deal.findById(dealID, function (err, deal) {
                        // check if the affected item is in the basket
                        if (_.findWhere(basket_items, {
                                productID: deal.affectedItemID
                            })) {
                            // check if you have enough of the item for the discount
                            var con_item = _.findWhere(deal.conditionalItems, {
                                itemID: b_item.productID
                            });

                            // variable to check how many multiples of the conditional item there are, 
                            // if theres a higher multiple of 1 theres more deals
                            var amountDiscount = parseInt(b_item.quantity / con_item.quantity);

                            if (amountDiscount >= 1) { // eligible for discount
                                // affected item
                                Product.findById(deal.affectedItemID, function (err, affectedItem) {
                                    console.log(deal.name);
                                    var itemDiscounted = (parseInt(affectedItem.price) / (100 / parseInt(deal.percentageDiscounted)));
                                    console.log("itemdisc" + itemDiscounted);
                                    if (amountDiscount == 1) { // only one affected item discounted
                                        basket.discountedAmount = parseInt(basket.discountedAmount) + itemDiscounted;
                                    } else { // more than one of the affected item discounted, check how many are in the basket
                                        var numAffectedInBasket = parseInt(_.findWhere(basket_items, {productID: deal.affectedItemID}).quantity);
                                        console.log("number of affected " + numAffectedInBasket);
                                        console.log("amoutndisc"+amountDiscount);
                                        
                                        basket.discountedAmount = parseInt(basket.discountedAmount + (itemDiscounted * ((numAffectedInBasket <= amountDiscount) ? numAffectedInBasket : amountDiscount)));
                                            

                                    }
                                    console.log("DISCOUNTED AMOUNT: " + basket.discountedAmount);


                                    basket.save(function (err) {
                                        if (err)
                                            console.log(err);
                                        else
                                            console.log("basket updated with discounted amount");
                                    });
                                });
                            }
                        } else {
                            console.log("nope not here");
                        }
                    });
                });
            });
        });
    });
}

util.updateBasketTotal = function (basketID) {
    Basket.findById(basketID, function (err, basket) {
        basket.price = 0; // reset
        Product.find(function (err, productslist) {

            _.each(basket.items, function (b_item) {
                basket.price = parseInt(basket.price) + (parseInt(_.findWhere(productslist, {
                    'id': b_item.productID
                }).price) * parseInt(b_item.quantity));
            });

            console.log("current basket price: " + basket.price);
            basket.save(function (err) {
                if (err)
                    console.log(err)
                else
                    console.log("basket price updated!");

                util.checkCurrentDeals(basket.id);

            });

        });
    });
}

module.exports = util;