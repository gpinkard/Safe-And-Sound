const express = require('express');
const mailer = require('nodemailer');
const fs = require('fs');

const app_email = 'gpinkard@pugetsound.edu';
const sec_email = 'khoefflinger@gmail.com';
const csvFilePath = './test_csv_file.csv';
const passwordFileName = 'password.txt';

const pass = fs.readFileSync(passwordFileName, 'utf-8', (err, data) => {
	if(err) throw err;
});

//console.log('notify - password: ' + pass);

console.log('app_email: ' + app_email);

const sendSecurityReport = () => {
	var transporter = mailer.createTransport({
		service: 'outlook',
		auth: {
			user: app_email,
			pass: pass
		}
	});

	var date = new Date();
	var now = date.toDateString();

	console.log('transporter:');
	console.log(transporter);

	var mailOptions = {
		from: app_email,
		to: sec_email,
		subject: 'SafeAndSound Report ' + now,
		text: 'Safe And Sound security report for ' + now + ' attached.',
		/*
		attachments: [
			{
				filename: 'checkin.csv',
				path: csvFilePath
			}
		]
		*/
	};

	transporter.sendMail(mailOptions, (err, info) => {
		if(err) throw err;
		else console.log(now + ': sending email to security services');
	});
};

sendSecurityReport();
