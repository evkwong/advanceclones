var pg = require('pg');

var username = 'postgres';
var password = '';
var host = 'localhost';
var dbName = 'advanceClonesDB';

var conStringPri = 'postgres://' + username + ':' + password + '@' + host + 
'/postgres';
var conStringPost = 'postgres://' + username + ':' + password + '@' + host + 
'/' + dbName;

pg.connect(conStringPri, function(err, client, done) { // connect to postgres db
  if (err)
    console.log('Error while connecting: ' + err); 
  client.query('CREATE DATABASE ' + dbName, function(err) { // create user's db
    if (err) 
      console.log('ignoring the error'); // ignore if the db is there
    client.end(); // close the connection

    pg.connect(conStringPost, function(err, clientOrg, done) {
      // create the table
      clientOrg.query('CREATE TABLE IF NOT EXISTS users ' + 
          '(id SERIAL PIMARY KEY, name VARCHAR (20) UNIQUE NOT NULL,' +
          'email VARCHAR (30) NOT NULL,' +
          'password VARCHAR (30) NOT NULL,' + 
          'avatar INTEGER);'
          );
    });
  });
});
