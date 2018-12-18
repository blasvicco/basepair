var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var hbs = require( 'express-handlebars' );
var indexRouter = require('./routes/index');

var app = express();

app.set('view engine', 'hbs');
// configure the view engine
app.engine('hbs', hbs({
  extname: 'hbs',
  partialsDir: '/home/tests/views/partials/'
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.raw({limit: '100mb'}));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true, parameterLimit: 100000}));

app.use('/', indexRouter);
app.use('/ex01', indexRouter);
app.use('/ex02', indexRouter);

module.exports = app;
