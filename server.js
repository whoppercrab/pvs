var express			= require('express');
var path			= require('path');
var bodyParser		= require('body-parser');
var passport		= require('passport');
var localStrategy	= require('passport-local').Strategy;
var flash			= require('connect-flash')
var session			= require('express-session');
var MongoDriver = require('./public/javascripts/mogo_driver.js');


var username = encodeURIComponent("admin");
var password = encodeURIComponent("wjdwkeorp");
var clusterUrl = "192.168.0.12:27017";
var authMechanism = "SCRAM-SHA-1";
// Replace the following with your MongoDB deployment's connection string.
var uri =
    `mongodb://${username}:${password}@${clusterUrl}/?authMechanism=${authMechanism}`;
//var DeviceProvider = require('./public/javascripts/deviceProvider-mongodb').DeviceProvider;
//deviceProvider = new DeviceProvider('mongodb://192.168.0.12:27017', 27017);
global.MongoDriver = new MongoDriver(uri, 27017,'test');
global.MongoDriver.connect(uri, 27017, 'test');


// var DeviceProvider2 = require('./public/javascripts/deviceProvider-mongodb').DeviceProvider2;
//  deviceProvider2 = new DeviceProvider2('127.0.0.1', 27017);

var routes = require('./routes');
var router = require('./routes/router');
var ap = require('./routes/ap');
var setting = require('./routes/setting')

var app = express();


app.use(session({
	secret: '!@#$%^&*()',
	saveUninitialized: false,
	resave: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(new localStrategy({
		usernameField : 'userid',
		passwordField : 'password',
		passReqToCallback : true
	}, function(req, userid, password, done) {
		if(userid==='ubpvs' && password==='ubpvs') {
			var user = { 'userid': 'ubpvs' };
			return done(null, user);
		} else {
			return done(null, false);
		}
	}
));

passport.serializeUser(function(user, done) {
	console.log(user);
	done(null, user.userid);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

app.use('/', routes);

app.use('/device', router);
app.use('/ap', ap);
app.use('/setting', setting);

app.use(express.static('public'));

app.set('port', process.env.PORT || 15959);

// set up handlebars view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if(app.get('env') === 'development') {
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

app.listen(app.get('port'), function() {
//app.listen(15959, function() {
    console.log('Express started on http://localhost:' + app.get('port') +
    '; press Ctrl-C to terminate.');
});
