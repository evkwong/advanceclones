var express = require('express');
var bycrypt = require('bcrypt');
var router = express.Router();

//var db = ;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;