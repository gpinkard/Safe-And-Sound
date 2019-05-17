const express = require('express');
const app = express();
const mysql = require('mysql');
const fs  = require('fs');
const async = require('async');
const mail = require('../notify/mail.js');

/*
const twilio = require('twilio');
const twilioAccountSid = '123'; // secure these on server end later
const twilioAuthToken = 'abc';
const twilioNumber = '+1234567890';
const client = new twilio(twilioAccountSid, twilioAuthToken);
*/

const database = require('../../app_db/db.js');

/*
 * This function initializes student data in the database, and sends
 * the student a confirmation email**
*/
module.exports.initStudentData = (req, res) => {
	var firstname = req.body.firstname.replace(/\s/g, ''); // Clears any whitespaces
	var lastname = req.body.lastname.replace(/\s/g, ''); // Clears any whitespaces
	var email = req.body.email.replace(/\s/g, ''); // Clears any whitespaces
	var phone = req.body.phone.replace(/\D/g, ''); //inserts only the number
	var lat = req.body.lat;
	var lng = req.body.lng;

	/**
	Check the value of the email, appending @pugetsound.edu as needed.
	*/
	if(!email.includes("@pugetsound.edu")){
		email+= "@pugetsound.edu";
	}

	/*
		Sends an email with the unique confirmation URL to the student
	*/
	var confirmString = String(mail.generateAuthToken(email));
	//Adds student to the Student table
	database.studentQuery(firstname, lastname, email, phone); // insert authentication token here
	//Adds this checkin to the Checkin table
	database.checkInQuery(lat, lng, phone, confirmString);
	//Sends the confirmation email with the unique confirmation URL
	mail.sendStudentConfirmEmail(email, firstname, confirmString);
	// call email function
	res.redirect('/confirm');
};

module.exports.confirmStudent = (req, res) => {
	database.confirmStudent(req, res);
	//console.log(path.join(__dirname, '/../../views/studentConfirmed.html'));
	//res.sendFile(path.join(__dirname, '/../../views/studentConfirmed.html'));
}

/*
const sendSMSConfirmation = (phoneNumber) => {
	client.messages.create({
		body: 'Please confirm you are safe at https://Safe-And-Sound/studentCheckInConfirm (required).',
		to: phoneNumber,
		from: twilioNumber
	});
};
*/
