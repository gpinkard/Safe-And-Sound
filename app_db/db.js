const mysql = require('mysql');
const fs  = require('fs');
const path = require('path');
const parser = require('json2csv').Parser;
const bcrypt = require('bcrypt');
const notify = require('../app_client/notify/mail.js');

const array = fs.readFileSync('../Safe-And-Sound/app_db/db.json');
const arrayStr = JSON.parse(array);

/**
	Handles the database interactions
*/

/*
	Connects to the database to allow for querying
*/
const conn = mysql.createConnection({
	host: arrayStr.host,
	user: arrayStr.user,
	password: arrayStr.password,
	database: arrayStr.database
});

conn.connect( (err) => {
	if(err) {
		console.log(err);
		throw err;
	} else {
		console.log('now connected to database ' + arrayStr.database);
	}
});

/*
	Sets the users pin in the database for the change password function
*/
exports.setPIN = (pin, username) => {
	username = ' "' + username + '"';
	console.log('pin in set: ' + pin);
	conn.query("UPDATE Admin SET pin = " + pin + " WHERE username=" + username);
};

/*
	Gets the pin from the database for change password confirmation
*/
exports.getPIN = (username, theirPIN, newPassword, res) => {
	username = ' "' + username + '"';
	conn.query("SELECT pin FROM Admin WHERE username=" + username, (err, result, fields) => {
		if(err) throw err;
		const jsonPIN = JSON.parse(JSON.stringify(result));
		console.log('pin(db): ');
		console.log(jsonPIN[0].pin);
		console.log('theirPIN: ' + theirPIN);
		var pin = Number(jsonPIN[0].pin);
		theirPIN = Number(theirPIN);

		//compare given pin to stored PIN
		//set password with bcrypt
		//redirect
		if(theirPIN === pin) {
		 	console.log('in if statement');
		 	bcrypt.hash(newPassword, 10, function(err, hash) {
		 		if(err){
		 			return err;
		 		} else {
					console.log('in else statement of bcrypt')
					hash = ' "' + hash + '"';
					conn.query("UPDATE Admin SET passwordHash =" + hash + " WHERE username=" + username, (err, result, fields) => {
						if(err) throw err;
						console.log('in query');
						console.log('calling security login');
			 			res.redirect('/securityLogin');
					});
		 			//TODO reset password hash in database
		 			//user.passwordHash = hash;
		 		}
		 	});
		 	//res.redirect('/securityLogin');
		} else {
			console.log('incorrect PIN');
			res.redirect('/changePassword');
		}
	});
};




/*
	Sets up login for Password with needed database interaction
*/
exports.loginHelper = ((username, password, done) => {
	username = ' "' + username + '"';
	conn.query("SELECT * FROM Admin WHERE username =" + username, (err, result, fields) => {
		if(err) throw err;
		//If username not found, returns to login page
		if(result.length === 0) return done(null, false, {message: 'user ' + username + ' not found'});

		const jsonSecurity = JSON.parse(JSON.stringify(result));
		let passwordStr = '';
		//console.log(jsonSecurity[0]);
		if(jsonSecurity.length !== 0) {
			passwordStr = jsonSecurity[0].passwordHash;
		}

		//Compares passwords and returns whethr or not the password is valid
		bcrypt.compare(password, passwordStr, (err, isValid) => {
			if(err) throw err;

			//Incorrect password
			if(!isValid) {
				console.log('incorrect password...');
				return done(null, false, {message: 'Incorrect password'});
			} else {
				//Correct password
				console.log('user ' + username + ' is now authenticated');
				let tempUser = {};
				tempUser.username = jsonSecurity[0].username;
				tempUser.password = jsonSecurity[0].passwordHash;
				tempUser.id = jsonSecurity[0].idAdmin;
				//console.log('tempUser:');
				//console.log(tempUser);
				return done(null, tempUser);
			}
		});
	});
});

/*
	Deserializes user, a method needed for Passport
*/
exports.deserialize = (username, cb) => {
	username = ' "' + username + '"';
	conn.query("SELECT * FROM Admin WHERE username =" + username, (err, result, fields) => {
		if(err) throw err;

		//Username does not exist in database
		if(result.length === 0) return done(null, false, {message: 'user ' + username + ' not found'});

		const jsonSecurity = JSON.parse(JSON.stringify(result));
		let tempUser = {};
		tempUser.username = jsonSecurity[0].username;
		tempUser.password = jsonSecurity[0].passwordHash;
		tempUser.id = jsonSecurity[0].idAdmin;
		return cb(null, tempUser);
		}
	)
};

/*
	A function to select a table.
*/
exports.selectQuery = (table) => {
	conn.query("SELECT * FROM " + table);
};

/*
	A function to insert into the student table.
*/
exports.studentQuery = (firstname, lastname, email, phone) => {
	conn.query("INSERT IGNORE INTO Student VALUES ('"+firstname+"', '"+lastname+"', '"+phone+"', '"+email+"')");
};

/*
	A fuction to insert into the checkIn table.
*/
exports.checkInQuery = (lat, lng, phone, isVerified, link) => {
	var time = makeNumericDateString();

	//conn.query("REPLACE INTO CheckIn VALUES ('"+time+"', '"+lat+"', '"+lng+"', '"+phone+"', '"+isVerified+"', '"+link+"')");

	conn.query("REPLACE INTO CheckIn VALUES ('"+time+"', '"+lat+"', '"+lng+"', '"+phone+"', null, null)");
};

/*
	A function to clear all values from the given table
*/
exports.deleteTable = (table) => {
	conn.query("DELETE FROM " + table);
};

/*
	A function to output a .csv file
*/

exports.exportTable = () => {
	conn.query('SELECT lName, fName, timeOf, phoneNum, email, lat, lng from Student NATURAL JOIN CheckIn GROUP BY phoneNum ORDER BY lName, timeOf DESC', (err, result, fields) => {
	//conn.query('SELECT lName, fName, phoneNum, email FROM Student', (err,  result, fields) => {
		const jsonStudents = JSON.parse(JSON.stringify(result));
		//const csvFields = ['lName', 'fName', 'phoneNum', 'email', 'lat', 'lng', 'time'];

		const csvFields = ['lName, fName, timeOf, phoneNum, email, lat, lng'];
		const json2CSVParser = new parser({csvFields});
		let data = '';
		if(jsonStudents.length !== 0) {
			data = json2CSVParser.parse(jsonStudents);
		}
		let now = makeNumericDateString();
		console.log('now: ' + now);
		console.log(data);
		let filename = __dirname + '/SecurityReports/'+ now + '.csv';
		console.log('writing file to ' + filename);
		fs.writeFile(filename, data, (err) => {
			if(err) console.log(err);
		})
		notify.sendSecurityReport('../Safe-And-Sound/app_db/SecurityReports/' + now + '.csv');
	});
};

const makeNumericDateString = () => {
	let date = new Date();
	let day = date.getDate();
	let month = date.getMonth()+1;
	let year = date.getFullYear();
	let hour = date.getHours();
	let minute = date.getMinutes();
	let seconds = date.getSeconds();
	return '' + year + '-' + month + '-' + day + '_' + hour + ':' + minute + ':' + seconds;
};

//console.log('exporting table...');
//exports.exportTable();
