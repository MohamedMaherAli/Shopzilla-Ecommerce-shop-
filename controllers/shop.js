const Product = require('../models/product');

// Home page
exports.getHomePage = async (req, res) => {
	const category = req.query.category;
	if (category && category !== 'all') {
		const products = await Product.getProductsByCategory(category);
		res.render('index', {
			prods: products,
			pageTitle: 'Shopzilla',
			message: req.flash('message')[0]
		});
	} else {
		const products = await Product.getAllProducts();
		res.render('index', {
			prods: products,
			pageTitle: 'Shopzilla'
		});
	}
};

//Product details
exports.getProductDetailsPage = async (req, res) => {
	const productId = req.params.id;
	const product = await Product.findById(productId);
	res.render('productDetailsPage', {
		product: product,
		pageTitle: 'Product Details'
	});
};
