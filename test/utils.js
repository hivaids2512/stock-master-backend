var request = require("request");
var config = require("../app/config");
var Resume = require("../app/modules/resume/resume.model");
var Section = require("../app/modules/section/section.model");
var User = require("../app/modules/auth/user.model");
var mongoose = require("mongoose");

exports.getToken = function(callback) {
  var endPoint = config.getEndPoint();
  sampleUser = { email: "tranquy2512@gmail.com", password: "@Quy@%!@!((#" };
  request.post(
    {
      url: endPoint + "/api/signin",
      body: sampleUser,
      json: true,
      headers: { "content-type": "application/json" }
    },
    function(err, res, body) {
      callback(err, body.token);
    }
  );
};

exports.clearData = function(callback) {
  mongoose.connect(config.getDbConnectionStr(), { useMongoClient: true }).then(
    () => {
      Resume.remove({}, function(err, removed) {
        Section.remove({}, function(err, removed) {
          callback(removed);
        });
      });
    },
    err => {
      console.log(err);
    }
  );
};

exports.clearUserData = function(callback) {
  mongoose.connect(config.getDbConnectionStr(), { useMongoClient: true }).then(
    () => {
      User.remove({}, function(err, removed) {
        callback(removed);
      });
    },
    err => {
      console.log(err);
    }
  );
};
