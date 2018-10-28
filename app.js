var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeContentRouter = require('./routes/home_content');
var productRouter = require('./routes/product');
var paymentRouter = require('./routes/payment');
var clientTokenRouter = require('./routes/client_token');
var checkoutRouter = require('./routes/checkout');
var ticketRouter = require('./routes/ticket');
var bookRouter = require('./routes/book');
var categoryRouter = require('./routes/category');
var categoriesRouter = require('./routes/categories');
var contactsRouter = require('./routes/contacts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/home_content', homeContentRouter);
app.use('/product', productRouter);
app.use('/payment', paymentRouter);
app.use('/client_token', clientTokenRouter);
app.use('/checkout', checkoutRouter);
app.use('/ticket', ticketRouter);
app.use('/book', bookRouter);
app.use('/category', categoryRouter);
app.use('/categories', categoriesRouter);
app.use('/contacts', contactsRouter);

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
