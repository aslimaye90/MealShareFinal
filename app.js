var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var apn = require('apn');

var routes = require('./routes/index');
var apiMeals = require('./routes/apiMeals');
var apiMealBuyers = require('./routes/mealArrayRoutes/apiMealBuyers');
var apiPersons = require('./routes/apiPersons');
var apiPersonsReviews = require('./routes/personArrayRoutes/apiPersonsReviews');
var apiSearch = require('./routes/apiSearch');
var apiLogin = require('./routes/apiLogin');
var apiOrderHistory = require("./routes/apiOrderHistory");
var apiFoodbanks = require("./routes/apiFoodbanks");

var app = express();

// view engine setup
/*app.set('views', path.join(__dirname, 'views'));*/
app.set('views', path.join(__dirname, 'frontEnd'));
app.set('view engine', 'ejs');

// Fix for Any Origin HTTP Calls
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Accept,x-access-token');
    if(req.method == 'OPTIONS'){
      res.status(200).end();
    } else {
    next();
    }
}

//MongoDB connection
mongoose.connect(config.mongoConnection, function(err) {
    if(err) {
        console.log('MongoDB connection error', err);
    } else {
        console.log('connected to MongoDB');
    }
});


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'frontEnd')));

// Fix for Any Origin HTTP Calls
app.use(allowCrossDomain);

app.use(function(req, res, next) {
    
    /*var options = {
        gateway: 'gateway.sandbox.push.apple.com',
        errorCallback: function(data){
            console.log(JSON.stringify(data));
        },
        cert: String(__dirname)+"/certificates/cert.pem",
        key:  String(__dirname)+"/certificates/key.pem",
        passphrase: 'AbhijeetManavKarunaJohnas',
        port: 2195,
        enhanced: true,
        cacheLength: 100
    };
    var apnConnection = new apn.Connection(options);
    
    var myDevice = new apn.Device('bb1e43213d50a725566a43248b721de8640661fdb0057899ead80d8ca17c64a5');
    var note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 3;
    note.sound = "ping.aiff";
    note.alert = "You have a new message";
    note.payload = {'messageFrom': 'Caroline'};
    apnConnection.pushNotification(note, myDevice);*/
    
    
    next(); 
});

//default routes
app.use('/', routes);
//login route
app.use('/api/login', apiLogin);
//meal routes
app.use('/api/meals/buyers', apiMealBuyers);
app.use('/api/meals', apiMeals);
app.use('/api/orders', apiOrderHistory);
//person routes
app.use('/api/persons', apiPersons);
app.use('/api/persons/reviews', apiPersonsReviews);
//search route
app.use('/api/search', apiSearch);
//foodbank routes
app.use('/api/foodbanks', apiFoodbanks);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
