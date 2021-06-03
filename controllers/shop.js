const Product = require('../models/product');
const ITEMS_PER_PAGE = 2;

// Home page
exports.getHomePage = async (req, res) => {
	const allProducts = await Product.find().countDocuments();
	const category = req.query.category;
	const page = +req.query.page || 1;
	if (category && category !== 'all') {
		const products = await Product.find({ category }).skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
		res.render('index', {
			prods: products,
			pageTitle: 'Shopzilla',
			currentPage: page,
			hasNextPage: allProducts > page * ITEMS_PER_PAGE,
			hasPreviousPage: page > 1,
			nextPage: page + 1,
			previousPage: page - 1,
			lastPage: Math.ceil(allProducts / ITEMS_PER_PAGE)
		});
	} else {
		const products = await Product.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
		res.render('index', {
			prods: products,
			pageTitle: 'Shopzilla',
			currentPage: page,
			hasNextPage: allProducts > page * ITEMS_PER_PAGE,
			hasPreviousPage: page > 1,
			nextPage: page + 1,
			previousPage: page - 1,
			lastPage: Math.ceil(allProducts / ITEMS_PER_PAGE)
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
