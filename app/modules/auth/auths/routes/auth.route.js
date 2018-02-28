"use strict";
module.exports = function(router) {
  var authController = require("../controllers/auth.controller");
  router
    .route("/signin")
    .post(authController.signIn);

    router
    .route("/signup")
    .post(authController.signUp);
};
