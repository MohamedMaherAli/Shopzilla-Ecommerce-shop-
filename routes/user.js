const express = require('express');
const router = new express.Router();
const userController = require('../controllers/user');

router.get('/register', userController.getRegisterPage);
router.post('/register', userController.postRegisterPage);

router.get('/login', userController.getLoginPage);
router.post('/login', userController.postLoginPage);

router.post('/logout', userController.postLogout);
module.exports = router;
