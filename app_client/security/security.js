const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

const mysql = require('mysql');
const fs  = require("fs");

const db = require('../../app_db/db.js');

/**
A back end function to clear the database.
*/
module.exports.clearDatabase = (req, res) => {
	if(req.body.dbClear === 'CLEARDB'){
		var d = new Date();
		var time = d.getTime();
		console.log("Database cleared: " + time);
		db.deleteTable("Student");
		res.redirect('/deleteConfirm');
	} else{
		res.redirect('/clearDatabase');
	}
};


module.exports.securityButtonController = (req, res) => {
	if(req.body.exportCSV === "true") {
		db.exportTable('./app_db/reports');
	}
	if(req.body.changePassword === "true") {
		var pin = Math.floor(Math.random()*10000);
		// TODO add pin to db admin table (keeps admin login info)
		// TODO send email with pin
		res.redirect('/changePassword');
	}
	res.redirect('/security');
};

module.exports.changePassword = (req, res) => {
	var temp_pin = Number(12345) //access pin from Database
	var theirPIN = Number(req.body.PIN);
	if(theirPIN === temp_pin) {
		bcrypt.hash(req.body.newPassword, 10, function(err, hash) {
			if(err){
				return err;
			} else {
				//TODO reset password hash in database
				//user.passwordHash = hash;
			}
		});
		res.redirect('/securityLogin');
	} else {
		res.redirect('/changePassword');
		//either return that PIN is incorrect or that some error occurred
	}
}
