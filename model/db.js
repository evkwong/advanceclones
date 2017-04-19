require('pg');

var username = 'postgres';
var password = '';
var host = 'localhost';

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
      clientOrg.query('CREATE TABLE IF NOT EXISTS ' + tableName + ' ' +
          '(...some sql...)';
          });
      });
    });
