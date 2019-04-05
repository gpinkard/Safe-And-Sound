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

module.exports.clearDBbutton = (req, res) => {
	console.log("fuckme");
	console.log(req.dbClear);
		if(req.dbClear === 'CLEARDB'){
			console.log("fuck me 2");
			res.send("Database Cleared.");
		}
		else 
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
