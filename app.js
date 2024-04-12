var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require("./config");
const mongoose = require("mongoose");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var labsRouter =  require('./routes/labs');
var attendanceRouter =  require('./routes/attendance');
// var labHubRouter = require('./routes/labhub');

let uri = `mongodb+srv://${config.database.username}:${config.database.password}@${config.database.host}`;

// Connect using mongoose
// some of the code appears to be decapricated with the lts version of Node... 
// (async function connectToMongoDB() {
//   try {
//     await mongoose.connect(uri, {
//       useUnifiedTopology: true,
//       useNewUrlParser: true,
//     });
//     console.log("DB successfully connected");
//   } catch (e) {
//     console.log("DB connection error", e);
//   }
// })();

(async function connectToMongoDB() {
  try {
    await mongoose.connect(uri);
    console.log("DB successfully connected");
  } catch (e) {
    console.log("DB connection error", e);
  }
})();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/labs', labsRouter);
app.use('/attendance', attendanceRouter);

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
