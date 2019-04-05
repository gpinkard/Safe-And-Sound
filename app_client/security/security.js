const express = require('express');
const app = express();
const mysql = require('mysql');
const fs  = require("fs");

const database = require('../../app_db/db.js');

module.exports.ensureLogin = (req, res) => {
	//things about login
	//send to security only page
	const username = 'security';
	const password = 'password';
	if(req.username == username && req.password == password){
		res.render('securityOnly');
	}
};

module.exports.buttons = (req, res) => {
	console.log("fuckme2");
	console.log(req.body.adminButtons);
		if(req.body.adminButtons == 'cleardb'){
			console.log("fuck me");
			res.render(prompt("Please enter CLEARDB to confirm you would like to clear the database."));
		}
	};
