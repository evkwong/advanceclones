var pgp = require('pg-promise')();
//const pg = require('pg');
var fs = require('fs'); //File sync.
var sql = fs.readFileSync('../models/db_setup.sql').toString();
var testString = 'postgres://vampireSnakes:blehssss@localhost:5432/advanceclones';

const connectionString = process.env.DATABASE_URL || testString;
var db = pgp(connectionString);
db.connect();
db.query(sql);
db.close();

/*exports.connectDB = function(input) {
	db.connect(
)};*/

module.exports = db; //Export reference to database.

//const client = new pgp.Client(connectionString);
//const query = db.query(sql);
//query.on('end', () => { client.end(); });