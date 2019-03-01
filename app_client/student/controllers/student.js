var express = require('express');
var app = express();
var mysql = require('mysql');
var fs  = require("fs");

var database = require('../../../app_db/db.js');

module.exports.sendStudentData = function(req, res) {
	console.log('made it to sendStudentData');
	console.log('req:');
	console.log(req);

	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var phone = req.body.phone;
	console.log(firstname);
	console.log(lastname);
	console.log(email);
	console.log(phone);
	//need to create a timestamp here, or in query??
	//and lat/long?
	var studentID = req.body.studentID;

	console.log('handing data to sql');
	database.studentQuery(database.conn, table, firstname, lastname, email, phone);
	console.log('completed data handoff');
	//console.log('res:');
	//console.log(res);
	//next();
};


/*
app.get('/studentlogin', function(req, res, next) {
	console.log('testing...');
});
*/
