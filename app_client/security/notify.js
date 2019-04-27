const express = require('express');
const mailer = require('nodemailer');
const fs = require('fs');

const app_email = 'PugetsoundSafeApp@pugetsound.edu';
const sec_email = 'gpinkard@pugetsound.edu';
const passwordFileName = 'password.txt';

const pass = fs.readFileSync(passwordFileName, 'utf-8', (err, data) => {
	if(err) throw err;
});

/*
  Initialize the transporter to send emails with
*/
const transporter = mailer.createTransport({
	host: 'webmail.pugetsound.edu',
	port: 587,
	secure: false,
	auth: {
		user: app_email,
		pass: pass
	}
});

/*
  Sends an email to UPS security with the .csv file specified by filepath (filepath is a relative path the the file in question)
*/
const sendSecurityReport = (filepath) => {
	// get date for email subject
	var date = new Date();
	var now = date.toDateString();

	var mailOptions = {
		from: app_email,
		to: sec_email,
		subject: 'SafeAndSound Check In Report ' + now,
		text: 'Safe And Sound check in report for ' + now + ' attached.\n\n-The UPS-Safe Team',
		attachments: [
			{
				filename: 'checkin.csv',
				path: filepath
			}
		]
	};

	transporter.sendMail(mailOptions, (err, info) => {
		if(err) throw err;
		else console.log(now + ': sending email to security services');
	});
};
