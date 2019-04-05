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

conn.connect(function(err) {
	if(err) {
    console.log(err);
		throw err;
	} else {
		console.log("now connected to database " + arrayStr.database);
	}
});

/*
	A function to select a table.
*/
exports.selectQuery = function(table) {
	conn.query("SELECT * FROM " + table);
}

/*
	A function to insert into the student table.
*/
exports.studentQuery = function (firstname, lastname, email, phone) {
  conn.query("INSERT IGNORE INTO Student VALUES ('"+email+"', '"+firstname+"', '"+lastname+"', '"+phone+"')");
};

/*
	A function to clear all values from the given table
*/
exports.deleteTable = function(table) {
	conn.query("DELETE FROM " + table);
}

/*
	A function to output a .csv file
*/
exports.exportTable = function(){
	conn.query();
}
