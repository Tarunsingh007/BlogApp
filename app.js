var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session=require('express-session');
var bodyParser=require('body-parser');
var expressValidator=require('express-validator');
var logger = require('morgan');
var mongo=require('mongodb');
var db=require('./bin/monk-connect.js').db;
var flash=require('connect-flash');
var hbs=require('hbs');

// var Handlebars = require("handlebars");
// var MomentHandler = require("handlebars.moment");
// MomentHandler.registerHelpers(Handlebars);

var mongoose=require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/posts');
var categoriesRouter = require('./routes/categories');
var app = express();

hbs.registerHelper('truncateText' ,(text,length)=>{
	var truncatedText=text.substring(0,length);
	return truncatedText;
});
var multer=require('multer');
app.use(multer({dest :"./public/images/uploads/"}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret:'secret',
	saveuninitialized:true,
	resave:true
}));
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public')));

//global vars
app.use(flash());
app.use((req,res,next)=>{
	res.locals.success_msg=req.flash('success_msg');
	res.locals.error_msg=req.flash('error_msg');
	res.locals.error=req.flash('error');
	res.locals.user=req.user||null;
	next();
});
app.use((req,res,next)=>{
	req.db=db;
	next();
});
//---------------------------------------------routes---------------------------------------------
app.use('/', indexRouter);
app.use('/posts', usersRouter);
app.use('/categories',categoriesRouter)
//catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   // res.render('error.hbs');

// });


module.exports = app;
