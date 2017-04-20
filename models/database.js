const pg = require('pg');
var fs = require('fs');

var sql = fs.readFileSync('db_setupNoComment.sql').toString();

const connectionString = process.env.DATABASE_URL || 'postgres://evan:evanWong@localhost:5432/advanceClones';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(sql);
query.on('end', () => { client.end(); });
