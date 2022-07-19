
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var moment = require('moment');
var fileUpload = require('express-fileupload');

require('dotenv').config();

var index = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');
var events = require('./routes/events');
var surveys = require('./routes/surveys');
var questions = require('./routes/qa');
var quizzes = require('./routes/quizzes');
var redeem = require('./routes/redeem');
var public = require('./routes/public');


var marketplaceJob = require('./routes/marketplaceJob');
var marketplaceComment = require('./routes/marketplaceCompanyComments');
var marketplaceUserApply = require('./routes/marketplaceUserApply');
var marketplaceCompanyQA = require('./routes/marketplaceCompanyQA');
var industry = require('./routes/industryCompany');
var category = require('./routes/category');
var hashtag = require('./routes/hashtag');

var serviceHousing = require('./routes/serviceHousing');

var financeLending = require('./routes/financeLending');
var financeBanking = require('./routes/financeBanking');

var advertisement = require('./routes/advertisement');

var listPriority = require('./routes/listPrioritizedBanners');

var glossary = require('./routes/glossary');
var livingCosts = require('./routes/livingCosts');
var exchangeRates = require('./routes/exchangeRates');
var risks = require('./routes/risks');

var incentives = require('./routes/incentives');
var userAdmin = require('./routes/userAdmin');

var aggregation = require('./routes/aggregation');
var urlsAggregation = require('./routes/urlsAggregation')
var apiQuestions = require('./routes/api/qa');
var apiRedeem = require('./routes/api/redeem');
var apiUsers = require('./routes/api/users');

var dataWarehouse = require('./routes/dataWarehouse');
var pushNotification = require('./routes/pushNotification');
var pushNotificationOld = require('./routes/pushNotificationOld');
var configurations = require('./routes/configurations');

var campaigns = require('./routes/campaigns');
var news = require('./routes/news');
var backupDatabase = require('./routes/backupDatabase');

var app = express();

app.locals.moment = moment;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload());

app.use(session({
  secret: 'butterflyhubxxx',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 7 * 24 * 60 * 60 * 1000, // 1 week
  }
}));

app.use(function (req, res, next) {
  if (req.session.isLoggedIn) {
    res.locals.username = req.session.username;
    res.locals.role = req.session.role;
    res.locals.permissions = req.session.permissions;
  }
  next();
});

var auth = function (req, res, next) {
  if (req.session && req.session.isLoggedIn) {
    return next()
  } else {
    req.session['requestingUrl'] = req.originalUrl
    res.redirect('/login');
  }
};

var apiAuth = function (req, res, next) {
  if (req.session && req.session.isLoggedIn) {
    return next()
  } else {
    res.status(401);
    res.json({
      code: 401,
      message: 'Unauthorized'
    });
  }
};

app.use('/', index);
app.use('/public', public);
app.use('/users', auth, users);
app.use('/posts', auth, posts);
app.use('/events', auth, events);
app.use('/surveys', auth, surveys);
app.use('/questions', auth, questions);
app.use('/quizzes', auth, quizzes);
app.use('/redeem', auth, redeem);
app.use('/api/questions', apiAuth, apiQuestions);
app.use('/api/redeem', apiAuth, apiRedeem);
app.use('/api/users', apiAuth, apiUsers);
app.use('/glossary', auth, glossary);
app.use('/living-costs', auth, livingCosts);
app.use('/exchange-rates', auth, exchangeRates);
app.use('/marketplace-job', auth, marketplaceJob);
app.use('/marketplace-companies-comment', auth, marketplaceComment);
app.use('/marketplace-companies-questions',auth,marketplaceCompanyQA);
app.use('/industries',auth,industry);
app.use('/category',auth,category);
app.use('/hashtags',auth,hashtag);
app.use('/marketplace-users-apply',auth, marketplaceUserApply);
app.use('/service-housing',auth, serviceHousing);
app.use('/finance-micro-lending',auth,financeLending);
app.use('/finance-banking',auth,financeBanking);
app.use('/advertisement',auth,advertisement);
app.use('/list-prioritized-banners',auth,listPriority);


// app.use('/risks', auth, risks);
app.use('/incentives', auth, incentives);
app.use('/user-admin', auth, userAdmin);

app.use('/aggregation',auth, aggregation);
app.use('/urls-aggregation',auth, urlsAggregation);

app.use('/data-warehouse', auth, dataWarehouse);
app.use('/push-notification', auth, pushNotification);
app.use('/push-notification-old', auth, pushNotificationOld);
app.use('/configurations', auth, configurations);
app.use('/campaigns', auth, campaigns);
app.use('/news', auth, news);
app.use('/database-backup-files', auth, backupDatabase);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = 3000;
app.listen(port, () => console.log(`You can access web portal at http://localhost:${port}`));

module.exports = app;
