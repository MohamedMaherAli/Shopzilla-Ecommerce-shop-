const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [ true, 'Name is required' ],
			minlength: [ 2, "Name can't be smaller than 2 characters" ],
			maxlength: [ 64, "Name can't be greater than 64 characters" ],
			trim: true
		},
		price: {
			type: Number,
			trim: true,
			required: [ true, 'Price is required' ]
		},
		description: {
			type: String,
			required: [ true, 'Description is required' ],
			trim: true
		},
		imageUrl: {
			type: String
		},
		category: {
			type: String,
			trim: true
		}
	},
	{
		timestamps: true
	}
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
