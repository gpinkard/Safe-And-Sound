var mysql = require('mysql');

var fs  = require('fs');
var array = fs.readFileSync('apples.txt').toString().split('\n');

// for(i in array){
//   console.log(array[i]);
// }

var conn = mysql.createConnection({
	// subject to change :)
	host: array[0],
	user: array[1],
	password: array[2],
	database: array[3],
});

conn.connect(function(err) {
	if(err) {
		throw err;
	} else {
		console.log("now connected to database " + conn.database);
	}
});

function exampleQuery(connection, table) {
	connection.query("SELECT * FROM " + table);
}

function studentQuery(connection, table, firstname, lastname, email, phone) {
  console.log('in studentQuery');
  //unclear what we need to put here??
}
