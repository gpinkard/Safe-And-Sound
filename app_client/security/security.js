const express = require('express');
const app = express();

const mysql = require('mysql');
const fs  = require("fs");



const database = require('../../app_db/db.js');

//const passport = require('passport');


module.exports.ensureLogin = (req, res) => {
	//things about login
	//send to security only page
	const username = 'security';
	const password = 'password';
	if(req.username == username && req.password == password){
		res.render('securityOnly');
	}
};

/**
A back end function to clear the database.
*/
module.exports.clearDatabase = (req, res) => {
	if(req.body.dbClear === 'CLEARDB'){
		var d = new Date();
		var time = d.getTime();
		console.log("Database cleared: " + time);
		database.deleteTable("Student");
		res.render('deleteConfirm');
	} else{
		res.render('clearDatabase');
	}
};

/**
A back end function to export the database.
*/
module.exports.securityOnlyButtons = (req, res) => {
	if(req.body.secButtons == true){
		var d = new Date();
		var time = d.getTime();
		console.log("Database exported: " + time);
		database.exportTable('../../app_db/SecurityReports');
		res.render('securityOnly');

	} else res.render('securityOnly');
};




// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       if (!user.verifyPassword(password)) { return done(null, false); }
//       return done(null, user);
//     });
//   }
// ));
