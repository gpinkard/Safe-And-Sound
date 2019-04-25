const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

const mysql = require('mysql');
const fs  = require("fs");

const database = require('../../app_db/db.js');

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
	console.log('made it here!!!');
	if(req.body.secButtons === "true"){
		console.log('EXPORT TABLE CALLED');
		//database.exportTable('../../app_db/SecurityReports');
		database.exportTable('~/Desktop');
		res.render('securityOnly');
	} else {
		console.log('secButton === FALSE');
		res.render('securityOnly');
	}
	if(req.body.changePassword === "true"){
		var pin = Math.random()*10000;
		console.log("pin: " + pin);
		//send email with rng PIN
		//add pin to database
		res.redirect('/changePassword');
	}
};

module.exports.changePassword = (req, res) => {
	//access pin from Database
	if(req.body.PIN === pin) {
		bcrypt.hash(req.body.newPassword, 10, function(err, hash) {
			if(err){
				return err;
			} else {
				//reset password hashin database
				//user.passwordHash = hash;
			}
		});
	} else {
		//either return that PIN is incorrect or that some error occurred
	}
}
