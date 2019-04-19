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

const transporter = mailer.createTransport({
	service: 'outlook',
	auth: {
		user: app_email,
		pass: pass
	}
});

console.log('transporter:');
console.log(transporter);

const sendSecurityReport = () => {
	var date = new Date();
	var now = date.toDateString();

	var mailOptions = {
		from: app_email,
		to: sec_email,
		subject: 'SafeAndSound Report ' + now,
		text: 'Safe And Sound security report for ' + now + ' attached.',
		attachments: [
			{
				filename: 'checkin.csv',
				path: csvFilePath
			}
		]
	};

	transporter.sendMail(mailOptions, (err, info) => {
		console.log('info:');
		console.log(info);
		if(err) throw err;
		else console.log(now + ': sending email to security services');
	});
};

sendSecurityReport();
