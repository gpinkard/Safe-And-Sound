const express = require('express');
const router = express.Router();
const app = express();
const path = require('path');

const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql');

const ctrlStudent = require('../app_client/student/student');
const ctrlSecurity = require('../app_client/security/security');
const ctrlDb = require('../app_db/db');

const fs  = require('fs');
let userDataJSON = fs.readFileSync('../Safe-And-Sound/authentication/users.json');
let userData = JSON.parse(userDataJSON);

let user = null; // this represents the logged in user

/*
######### TODO #########
have email saved somehow on initStudentData, then add to userConfirmLookup which will map
the confirm/auth_token url to a email address. If the email address matches the auth
token, we confirm them as save in the db.
*/
let userConfirmLookup = {}; // object that maps confirm tokens to emails

router.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 1000*60*60*24 } //one day
}));

router.use(passport.initialize());
router.use(passport.session());

// TODO move security credentials from server to db...
passport.use(new LocalStrategy(ctrlDb.loginHelper));

passport.serializeUser(function(user, cb) {
	cb(null, user.username);
});

passport.deserializeUser(ctrlDb.deserialize);

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/../views/studentFacing.html'));
});

router.post('/', ctrlStudent.initStudentData);

router.get('/confirm', (req, res) => {
	res.sendFile(path.join(__dirname + '/../views/studentVerify.html'));
});

router.get('/securityLogin', (req, res) => {
	res.sendFile(path.join(__dirname + '/../views/securityLogin.html'));
});


router.post('/securityLogin', passport.authenticate('local', {failureRedirect: '/securityLogin'}), (req, res) => {
	res.redirect('/security');
});

router.get('/security', (req, res) => {
	if(req.isAuthenticated()) {
		res.sendFile(path.join(__dirname + '/../views/securityOnly.html'));
	} else {
		return res.redirect('/securityLogin');
	}
});

router.post('/security', ctrlSecurity.securityButtonController);

router.get('/clearDatabase', (req, res) => {
	if(req.isAuthenticated()) {
		res.sendFile(path.join(__dirname + '/../views/clearDatabase.html'));
	} else {
		res.redirect('/securityLogin');
	}
});

router.post('/clearDatabase', ctrlSecurity.clearDatabase);

router.get('/deleteConfirm', (req, res) => {
	if(req.isAuthenticated()) {
		res.sendFile(path.join(__dirname + '/../views/deleteConfirm.html'));
	} else {
		res.redirect('/securityLogin');
	}
});

router.get('/changePassword', (req, res) => {
	if(req.isAuthenticated()) {
		res.sendFile(path.join(__dirname + '/../views/changePassword.html'));
	} else {
		res.redirect('/securityLogin');
	}
});

router.get('/confirm_test/*', (req, res) => {
	console.log('url');
	console.log(req.url);
	res.sendFile(path.join(__dirname + '/../views/studentConfirmed.html'));
});

router.post('/changePassword', ctrlSecurity.changePassword);

module.exports = router;
