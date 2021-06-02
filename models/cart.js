const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
	items: [
		{
			id: String,
			amount: Number
		}
	],
	totalPrice: {
		type: Number,
		default: 0
	},
	orderPlaced: {
		type: Boolean,
		default: false
	},
	customerDetails: {
		name: {
			type: String,
			trim: true
		},
		address: {
			type: String,
			trim: true
		},
		email: {
			type: String,
			trim: true,
			lowercase: true
		},
		phone: {
			type: Number
		},
		timestamp: {
			type: Date,
			default: Date.now
		}
	}
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
