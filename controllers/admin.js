const Product = require('../models/product');
const Cart = require('../models/cart');
const fs = require('fs');

const ITEMS_PER_PAGE = 2;
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
		const allProducts = await Product.find().countDocuments();
		const page = +req.query.page || 1;
		const products = await Product.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);

		res.render('adminProducts', {
			prods: products,
			pageTitle: 'Admin Products',
			currentPage: page,
			hasNextPage: allProducts > page * ITEMS_PER_PAGE,
			hasPreviousPage: page > 1,
			nextPage: page + 1,
			previousPage: page - 1,
			lastPage: Math.ceil(allProducts / ITEMS_PER_PAGE)
		});
	} catch (e) {
		console.log(e);
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
		const carts = await Cart.find({ orderPlaced: true });
		for (let cart of carts) {
			let amount = 0;
			cart.items = cart.items.filter((item) => {
				if (item.id === req.body.id) {
					amount = item.amount;
					cart.warningMessages.push(`WARNING "A Product was ordered but then deleted from database"
					product details : Price : (${product.price}) - name : (${product.name}) - category : (${product.category}) - amount ordered (${item.amount})
					`);
				}
				return item.id !== req.body.id;
			});
			cart.totalPrice -= product.price * amount;
			await cart.save();
		}
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

//Delete an order
exports.postDeleteOrder = async (req, res) => {
	try {
		await Cart.findByIdAndDelete(req.body.cartId);
		res.redirect('/admin/orders');
	} catch (e) {
		console.log(e);
		res.send(e);
	}
};
