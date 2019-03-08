const mysql = require('mysql');

const fs  = require('fs');
const array = fs.readFileSync('../Safe-And-Sound/app_db/db.json');
const arrayStr = JSON.parse(array);

const conn = mysql.createConnection({
	// subject to change :)
	host: arrayStr.host,
	user: arrayStr.user,
	password: arrayStr.password,
	database: arrayStr.database
});

conn.connect( (err) => {
	if(err) {
		throw err;
	} else {
		console.log("now connected to database " + arrayStr.database);
	}
});

exports.selectQuery = (table) => {
	connection.query("SELECT * FROM " + table);
};

// insert student data into the database (this is when they register)
exports.insertStudentData = (firstname, lastname, email, phone) => {
	conn.query("INSERT IGNORE INTO Student VALUES ('"+email+"', '"+firstname+"', '"+lastname+"', '"+phone+"')");
};

// gets students name, email, status, gpsloc, timestamp
exports.getStudentData = (err) => {
	// put conn.query() here
	if(err) {
		throw(err);
	}
};
