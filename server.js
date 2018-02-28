var express = require("express"),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require("body-parser"),
  mongoose = require('mongoose'),
  winston = require('winston'),
  glob = require('glob'),
  cors = require('cors'),
  morgan = require('morgan'),
  passport = require('passport');

var config = require("./app/config")

mongoose.Promise = global.Promise;

//Allow Cross Domain Request
app.use(cors())

//Using Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Log requests to console
app.use(morgan('dev'));  

//Allow Passport
app.use(passport.initialize());
require('./app/config/passport')(passport);
//Init Routes
var routes = glob.sync(__dirname + '/app/modules/*/*/routes/*.route.js');
routes.forEach(function (route) {
  var router = express.Router();
  var moduleRoutes = require(route);
  moduleRoutes(router);
  app.use('/api', router);
})

mongoose.connect(config.getDbConnectionStr(), {useMongoClient: true}).then(
  () => {
    app.listen(port);
    winston.log('info', "Server started on: " + port);
  },
  err => {
    console.log(err)
  }
);
