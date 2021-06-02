const express = require('express');
const path = require('path');
require('./db/mongoose');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');

const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const cartRoutes = require('./routes/cart');

const MongoDBStore = require('connect-mongodb-session')(session);

// MULTER CONFIGURATION
const multer = require('multer');
const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};
const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images');
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname + '-' + Date.now());
	}
});

// COOKIE SESSION CONFIGURATION
const store = new MongoDBStore({
	uri: process.env.MONGODB_URL,
	collection: 'sessions'
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));
app.use(
	session({
		secret: '5a8621edce54e8ec4ef67fe0f17c2416860f83c7',
		store: store,
		resave: false,
		saveUninitialized: false
	})
);
app.use(flash());

app.set('view engine', 'ejs');

app.use(shopRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use(cartRoutes);

app.use(function(req, res, next) {
	res.status(404).render('404', {
		pageTitle: '404 page is not found'
	});
});
module.exports = app;
