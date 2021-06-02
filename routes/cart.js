const express = require('express');
const router = new express.Router();
const cartController = require('../controllers/cart');

// recieve a POST request to add an item to a cart
router.post('/cart/products', cartController.postItemToCart);

//receieve a GET request to show all items in cart
router.get('/cart', cartController.getCart);

//recieve a POST request to delete an item from the cart
router.post('/cart/products/delete', cartController.postCartDelete);

//get order page
router.get('/cart/order', cartController.getOrderPage);

//post order Page
router.post('/cart/order', cartController.postOrderPage);

//Success order placing
router.get('/cart/order/success', cartController.successOrderPage);

module.exports = router;
