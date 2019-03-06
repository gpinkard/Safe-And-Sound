const mysql = require('mysql');

const fs  = require('fs');
const array = fs.readFileSync('../Safe-And-Sound/app_db/db.json');
const arrayStr = JSON.parse(array);
// for(i in array){
//   console.log(array[i]);
// }

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

exports.selectQuery = function(table) {
	connection.query("SELECT * FROM " + table);
}

exports.studentQuery = function (firstname, lastname, email, phone) {
  conn.query('INSERT IGNORE INTO Student VALUES (${email}, ${fName}, ${lName}, ${phoneNum})');
};
