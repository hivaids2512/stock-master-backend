"use strict";

var mongoose = require("mongoose"),
  User = require("../../../application/user/models/user.model"),
  jwt = require("jsonwebtoken"),
  config = require("../../../../config");

exports.signIn = function(req, res) {
  User.findOne({ userName: req.body.userName })
    .then(user => {
      if (!user) {
        res.send({
          success: false,
          msg: "Authentication failed. User not found."
        });
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.sign(user, config.configData.secretKey, {
              expiresIn: "100h"
            });
            user.password = undefined
            res.json({ success: true, token: "JWT " + token, data: user });
          } else {
            res.send({
              success: false,
              msg: "Authentication failed. Wrong password."
            });
          }
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.json(err);
    });
};

exports.signUp = function(req, res) {
  var newUser = new User(req.body);
  newUser
    .save()
    .then(user => {
      res.json({ success: true, msg: "Successful created new user." });
    })
    .catch(err => {
      res.json({ success: false, msg: "Username already exists." });
    });
};
