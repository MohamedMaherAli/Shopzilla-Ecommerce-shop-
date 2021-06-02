const express = require('express');
const router = new express.Router();
const adminController = require('../controllers/admin');
const auth = require('../middlewares/auth');

//Admin main page
router.get('/admin', auth, adminController.getAdminMainPage);

//Admin Products page
router.get('/admin/products', auth, adminController.getAdminProductsPage);

//Add Product route
router.get('/admin/add-product', auth, adminController.getAdminAddProduct);
router.post('/admin/add-product', auth, adminController.postAdminAddProduct);

//Edit Product route
router.get('/admin/products/edit/:id', auth, adminController.getEditProductPage);
router.post('/admin/products/edit/:id', auth, adminController.postEditProductPage);

//Delete Product route
router.post('/admin/products/delete', auth, adminController.postDeleteProduct);

//Get admin orders page
router.get('/admin/orders', auth, adminController.getAdminOrderPage);

module.exports = router;
