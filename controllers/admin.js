const Product = require('../models/product');
const Cart = require('../models/cart');
const fs = require('fs');

//Gets Admin Main Page
exports.getAdminMainPage = (req, res) => {
	res.render('adminPanel', {
		name: req.session.name,
		pageTitle: 'Admin Dashboard'
	});
};

//Gets Admin Products Page
exports.getAdminProductsPage = async (req, res) => {
	try {
		const products = await Product.find({});
		res.render('adminProducts', {
			prods: products,
			pageTitle: 'Admin Products'
		});
	} catch (e) {
		res.send(e);
	}
};

//Gets admin add product form
exports.getAdminAddProduct = (req, res) => {
	res.render('adminAddProduct', {
		pageTitle: 'Admin Add-Product'
	});
};

//Posts admin add product form
exports.postAdminAddProduct = async (req, res) => {
	try {
		const { name, price, description, category } = req.body;
		const image = req.file;
		const imageUrl = image.path.slice(7);
		if (!image) {
			throw new Error('Attached File is not an image');
		}

		const product = new Product({
			name,
			price,
			description,
			category,
			imageUrl
		});
		await product.save();
		res.redirect('/admin/products');
	} catch (e) {
		res.render('adminAddProduct', {
			message: {
				type: 'error',
				body: e
			}
		});
	}
};

//Gets Edit product page
exports.getEditProductPage = async (req, res) => {
	const product = await Product.findById(req.params.id);
	res.render('adminEditProduct', {
		product: product,
		pageTitle: 'Admin Edit-Product'
	});
};

//Posts Edit product page
exports.postEditProductPage = async (req, res) => {
	const { name, price, description, category } = req.body;
	try {
		const product = await Product.findById(req.params.id);
		if (req.file) {
			fs.unlinkSync(`images/${product.imageUrl}`);
			product.imageUrl = req.file.path.slice(7);
		}
		product.name = name;
		product.price = price;
		product.description = description;
		product.category = category;
		await product.save();
		res.redirect('/admin/products');
	} catch (e) {
		res.render('adminEditProduct', {
			message: {
				type: 'error',
				body: e
			}
		});
	}
};

//Deletes a product
exports.postDeleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.body.id);
		fs.unlinkSync(`images/${product.imageUrl}`);
		await Product.findByIdAndDelete(req.body.id);
		res.redirect('/admin/products');
	} catch (e) {
		console.log(e);
		res.send(e);
	}
};

//Get admin orders page
exports.getAdminOrderPage = async (req, res) => {
	const carts = await Cart.find({ orderPlaced: true });

	//passing product info into item object so we can render the data to the user
	for (let cart of carts) {
		for (let item of cart.items) {
			const product = await Product.findById(item.id);
			item.product = product;
		}
	}
	res.render('adminOrders', {
		carts: carts,
		pageTitle: 'Admin Orders'
	});
};
