const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [ true, 'Name is required' ],
			minlength: [ 2, "Name can't be smaller than 2 characters" ],
			maxlength: [ 64, "Name can't be greater than 64 characters" ],
			trim: true
		},
		password: {
			type: String,
			required: [ true, 'Password is required' ],
			trim: true,
			validate(value) {
				if (value.includes('password')) {
					throw new Error('Password cannot contain [password] keyword');
				}
			}
		},
		email: {
			type: String,
			trim: true,
			maxlength: [ 128, "Email can't be greater than 128 characters" ],
			required: [ true, 'Email is required' ],
			unique: [ true, 'Email in use' ],
			index: true,
			lowercase: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error('Email is invalid');
				}
			}
		}
	},
	{
		timestamps: true
	}
);

//Hash the password before saving
userSchema.pre('save', async function(next) {
	const user = this;
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

// check the user credibility to login
userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error('Invalid Email or password');
	}
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw new Error('Invalid Email or password');
	}

	return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
