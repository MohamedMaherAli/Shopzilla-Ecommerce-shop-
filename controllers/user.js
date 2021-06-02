const User = require('../models/user');
require('../db/mongoose');

//Shows a registeration page
exports.getRegisterPage = (req, res) => {
	let error = req.flash('error');
	if (error.length > 0) {
		error = error[0];
	} else {
		error = null;
	}
	res.render('register', { message: error, pageTitle: 'Registration' });
};

//Reigsters the user to the database
exports.postRegisterPage = async (req, res) => {
	try {
		//checking email duplication
		const existingUser = await User.findOne({ email: req.body.email });
		if (existingUser) {
			req.flash('error', 'Email already Exists');
			return res.redirect('/register');
		}
		const user = new User(req.body);
		await user.save();
		res.redirect('/login');
	} catch (error) {
		if (error.errors.name) {
			req.flash('error', 'Name is required and cannot be less than 2 chars or more than 64 chars');
		} else if (error.errors.password) {
			req.flash('error', 'Password is required and it cannot contain [password] keyword  ');
		} else {
			req.flash('error', 'Invalid input');
		}
		res.redirect('/register');
	}
};

//shows login page
exports.getLoginPage = (req, res) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('login', {
		error: message,
		pageTitle: 'Login '
	});
};

//Login the user
exports.postLoginPage = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findByCredentials(email, password);
		req.session.isLoggedIn = true;
		req.session.name = user.name;
		return res.redirect('/admin');
	} catch (e) {
		req.flash('error', 'Invalid Email or Password');
		res.redirect('/login');
	}
};

//post logout user
exports.postLogout = (req, res) => {
	req.session.destroy(function(err) {
		res.redirect('/login');
	});
};
