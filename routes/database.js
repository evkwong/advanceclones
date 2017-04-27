var pgp = require('pg-promise')();
var pgpString = 'postgres://vampiresnakes:blehssss@localhost:5432/advanceclones';

const connectionString = process.env.DATABASE_URL || pgpString;
var db = pgp(connectionString);
db.connect();

module.exports = db; //Export reference to database.