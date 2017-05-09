var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var session = require('express-session');
var expressValidator = require('express-validator');
var favicon = require('serve-favicon');
var flash = require('connect-flash');
var logger = require('morgan');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var path = require('path');

//App variables.
var app = express();
var index = require('./routes/index');
var users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());

//Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Express Session
app.use(session({
  secret: 'vampire snakes',
  resave: false,
  saveUninitialized: true
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Do not move these below following error functions.
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//flash error messages
app.use(function(req,res,next){
	res.locals.success_messages = req.flash('success_messages');
	res.locals.error_messages = req.flash('error_messages');
	next();
});

module.exports = app;
