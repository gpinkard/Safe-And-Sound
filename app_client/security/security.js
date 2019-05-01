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
	if(req.body.dbClear === 'CLEARALLDB'){
		var d = new Date();
		var time = d.getTime();
		console.log("All Databases cleared: " + time);
		db.deleteTable("Student");
		db.deleteTable("CheckIn");
		res.redirect('/deleteConfirm');
	} else{
		res.redirect('/clearDatabase');
	}
};

module.exports.clearCheckin = (req, res) => {
	if(req.body.dbClear === 'CLEARCHECKIN'){
		var d = new Date();
		var time = d.getTime();
		console.log("CheckIn table cleared: " + time);
		db.deleteTable("CheckIn");
		res.redirect('/deleteConfirm');
	} else{
		res.redirect('/clearCheckin');
	}
};


module.exports.securityButtonController = (req, res) => {
	if(req.body.exportCSV){
		db.exportTable();

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
		notify.sendChangePassword(pin);
		// TODO send email with pin
		res.redirect('/changePassword');
	}
	res.redirect('/security');
};

async function generatePIN(username, theirpin, newPassword, callback, res){
	console.log('getPIN: ' + db.getPIN(username));
	console.log('before ourpin');
	var ourpin = await db.getPIN(username);
	console.log('after ourpin');
	callback(username, ourpin, theirpin, newPassword, res);
}

change = (username, ourpin, theirpin, newPassword, res) => {
	console.log('in change');
	console.log(ourpin);
	if(theirpin === ourpin) {
		console.log('in if statement');
		bcrypt.hash(newPassword, 10, function(err, hash) {
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
		console.log('in else statement');
		res.redirect('/changePassword');
		//either return that PIN is incorrect or that some error occurred
	}
}

module.exports.changePassword = (req, res) => {
	generatePIN(req.user.username, req.body.PIN, req.body.newPassword, change, res);
	//var temp_pin = Number(12345) //access pin from Database
	// console.log('getPIN: ' + db.getPIN(req.user.username));
	// var pin = db.getPIN(req.user.username);
  //
	// var theirPIN = Number(req.body.PIN);
	// console.log('theirPIN:');
	// console.log(theirPIN);
	// pin = Number(pin);
	// console.log('pin: ');
	// console.log(pin);
	// if(theirPIN === pin) {
	// 	console.log('in if statement');
	// 	bcrypt.hash(req.body.newPassword, 10, function(err, hash) {
	// 		if(err){
	// 			return err;
	// 		} else {
	// 			//TODO reset password hash in database
	// 			//user.passwordHash = hash;
	// 			res.redirect('/securityLogin');
	// 		}
	// 	});
	// 	res.redirect('/securityLogin');
	// } else {
	// 	console.log('getPIN: ' + db.getPIN(req.user.username));
	// 	console.log('in else statement');
	// 	res.redirect('/changePassword');
	// 	//either return that PIN is incorrect or that some error occurred
	// }
}
