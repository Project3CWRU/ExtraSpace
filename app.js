
// *** This file is the initial starting point for the Node/Express server.

// *** Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');

// *** Sets up the Express App
var app = express();
var PORT = process.env.PORT || 3000;

// *** Requiring our models for syncing
var db = require("./models");

require('./config/passport')(passport);
// If we are at root or /, look in the public folder.
app.use(express.static(__dirname + '/'));
console.log(__dirname);

app.use(session({ secret: "123", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// *** Sets up the Express app to handle data parsing
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

// *** Override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// *** Set Handlebars
var exphbs  = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// *** Routes
require('./controllers/routes.js')(app, passport);
// app.use('/', routes);

// *** Syncing our sequelize models and then starting our express app
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
