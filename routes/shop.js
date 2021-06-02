const express = require('express');
const router = new express.Router();
const shopController = require('../controllers/shop');
// Main home page
router.get('/', shopController.getHomePage);

//Product Details
router.get('/product/:id', shopController.getProductDetailsPage);

module.exports = router;
