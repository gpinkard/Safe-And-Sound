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
		res.render('deleteConfirm');
	} else{
		res.render('clearDatabase');
	}
};


module.exports.securityButtonController = (req, res) => {
	if(req.body.exportCSV === "true") {
		db.exportTable('./app_db/reports');
	} else if(req.body.changePassword === "true") {
		// TODO generate random pin
		// TODO add pin to db admin table (keeps admin login info)
		// TODO send email with with
		res.redirect('/changePassword');
	}
	res.redirect('/security');
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
