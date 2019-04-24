const express = require('express');
const app = express();

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

/**
A back end function to export the database.
*/
module.exports.securityOnlyButtons = (req, res) => {
	console.log('made it here!!!');
	if(req.body.secButtons === "true"){
		console.log('EXPORT TABLE CALLED');
		//database.exportTable('../../app_db/SecurityReports');
		db.exportTable('~/Desktop');
		res.render('securityOnly');

	} else {
		console.log('secButton === FALSE');
		res.render('securityOnly');
	}
};

module.exports.securityButtonController = (req, res) => {
	console.log('req.body.secButtons');
	//console.log(req.body)
	if(req.body.secButtons === "true") {
		db.exportTable('./app_db/reports');
		res.sendFile(path.join(__dirname + '../../views/securityOnly.html'));
	}
};
