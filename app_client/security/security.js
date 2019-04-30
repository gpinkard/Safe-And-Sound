const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

const mysql = require('mysql');
const fs  = require("fs");

const db = require('../../app_db/db.js');
const notify = require('../notify/mail.js')

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
	if(req.body.exportCSV) {
		// TODO SENDS EMAIL BEFORE FILE IS MADE.
		let filename = await (db.exportTable());
		console.log("FILENAME");
		console.log(filename);
		Promise (notify.sendSecurityReport(filename));
		console.log("EMAIL SENT !!!!!!!!!!!!");
		// TODO send email with the report
	}
	if(req.body.changePassword === "true") {
		var pin = Math.floor(Math.random()*10000);
		// let pin = '';
		// for(let i = 0; i < 6; i++) {
		// 	let cur = Math.floor(Math.random()*10);
		// 	pin += String(cur);
		// }
		console.log(pin);
		console.log('req.user.username');
		console.log(req.user.username);
		db.setPIN(pin, req.user.username);
		// TODO add pin to db admin table (keeps admin login info)
		// TODO send email with pin
		res.redirect('/changePassword');
	}
	res.redirect('/security');
};

module.exports.changePassword = (req, res) => {
	//var temp_pin = Number(12345) //access pin from Database
	console.log('getPIN: ' + db.getPIN(req.user.username));
	var pin = db.getPIN(req.user.username);

	var theirPIN = Number(req.body.PIN);
	console.log('theirPIN:');
	console.log(theirPIN);
	pin = Number(pin);
	console.log('pin: ');
	console.log(pin);
	if(theirPIN === pin) {
		console.log('in if statement');
		bcrypt.hash(req.body.newPassword, 10, function(err, hash) {
			if(err){
				return err;
			} else {
				//TODO reset password hash in database
				//user.passwordHash = hash;
				res.redirect('/securityLogin');
			}
		});
		res.redirect('/securityLogin');
	} else {
		console.log('getPIN: ' + db.getPIN(req.user.username));
		console.log('in else statement');
		res.redirect('/changePassword');
		//either return that PIN is incorrect or that some error occurred
	}
}
