const Cart = require('../models/cart');
const Product = require('../models/product');

//recieve a post request to add an item to a cart
exports.postItemToCart = async (req, res) => {
	let cart;
	if (!req.body.amount || req.body.amount < 0) {
		req.body.amount = 1;
	}
	if (!req.session.cartId) {
		cart = new Cart({ items: [] });
		req.session.cartId = cart._id;
		cart.items.push({ id: req.body.productId, amount: req.body.amount });
		await cart.save();
		// return res.send('Product added to the cart for first time for a  new cart');
		res.redirect('/cart');
	} else {
		cart = await Cart.findById(req.session.cartId);
		const existingItem = cart.items.find((item) => {
			return item.id === req.body.productId;
		});
		if (existingItem) {
			existingItem.amount += parseInt(req.body.amount);
			await cart.save();
			// return res.send(`Product added again for the ${existingItem.amount} time`);
			res.redirect('/cart');
		} else {
			cart.items.push({ id: req.body.productId, amount: req.body.amount });
			await cart.save();
			// return res.send('product added for the first time for an EXISTING CART');
			res.redirect('/cart');
		}
	}
};

// recieve a get request to show all items in a cart
exports.getCart = async (req, res) => {
	if (!req.session.cartId) {
		return res.redirect('/');
	}

	const cart = await Cart.findById(req.session.cartId);
	if (!cart) {
		return res.redirect('/');
	}
	let totalPrice = 0;
	for (let item of cart.items) {
		const product = await Product.findById(item.id);
		item.product = product;
		totalPrice += item.product.price * item.amount;
	}
	cart.totalPrice = totalPrice;
	await cart.save();
	res.render('cart', {
		items: cart.items,
		total: totalPrice,
		pageTitle: 'Customer cart'
	});
};

//recieve a post request to delete an item
exports.postCartDelete = async (req, res) => {
	const cart = await Cart.findById(req.session.cartId);
	const items = cart.items.filter((item) => {
		return item.id !== req.body.itemId;
	});
	cart.items = items;
	await cart.save();
	res.redirect('/cart');
};

// ========================= Order Placement =====================
exports.getOrderPage = async (req, res) => {
	if (!req.session.cartId) {
		return res.redirect('/');
	}
	// const cart = await Cart.findById(req.session.cartId);
	let error = req.flash('error');
	if (error.length > 0) {
		error = error[0];
	} else {
		error = null;
	}
	res.render('order', {
		message: error,
		pageTitle: 'Placing orders'
	});
};

exports.postOrderPage = async (req, res) => {
	if (!req.session.cartId) {
		return res.redirect('/');
	}
	try {
		const { name, email, adress, phone } = req.body;
		const cart = await Cart.findById(req.session.cartId);
		if (cart.items <= 0) {
			throw new Error();
		}
		cart.customerDetails.name = name;
		cart.customerDetails.email = email;
		cart.customerDetails.address = adress.toString();
		cart.customerDetails.phone = phone;
		cart.orderPlaced = true;
		await cart.save();
		return res.redirect('/cart/order/success');
	} catch (e) {
		req.flash('error', 'Something went wrong, no cart data were provided');
		res.redirect('/cart/order');
	}
};

exports.successOrderPage = async (req, res) => {
	if (!req.session.cartId) {
		return res.redirect('/');
	}
	const cart = await Cart.findById(req.session.cartId);
	if (cart.orderPlaced !== true) {
		return res.redirectp('/');
	}
	res.render('success', {
		pageTitle: 'Orders placed'
	});
};
