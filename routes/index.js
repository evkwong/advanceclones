var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/registration', function(req, res) {
  res.render('registration', {
    title: 'Registration'
  });
});

module.exports = router;
