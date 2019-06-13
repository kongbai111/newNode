var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyparser = require('body-parser')

var cors = require('cors')
var app = express()

var corsOptions = {
  origin: '*', //允许所有访问
  optionsSuccessStatus: 200 
}
app.use('*', cors(corsOptions), function (req, res, next) {
  return next()
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

// 路由
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var gongyongRouter = require('./routes/gongyong');
var powerRouter = require('./routes/power');
var powerRelationRouter = require('./routes/powerRelation');


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/gongyong', gongyongRouter);
app.use('/power', powerRouter);
app.use('/powerRelation', powerRelationRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
