const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const fs  = require('fs');
const promise = require('promise');

const db = require('../../app_db/db.js');
const notify = require('../notify/mail.js')

/**
	Handles functions related to security side
*/

/*
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

/*
	Handles buttons on the security landing page, sending the appropriate response
*/
module.exports.securityButtonController = (req, res) => {
	if(req.body.exportCSV){
		db.exportTable();
	}
	//Change password button
	if(req.body.changePassword === "true") {
		//Creates and sets pin in database
		var pin = Math.floor(Math.random()*1000000);
		db.setPIN(pin, req.user.username);
		//Sends PIN to security
		notify.sendChangePassword(pin);
		res.redirect('/changePassword');
	} else {
		res.redirect('/security');
	}
};

/*
	Change password full function
*/
module.exports.changePassword = (req, res) => {
	db.getPIN(req.user.username, req.body.PIN, req.body.newPassword, res);
}
