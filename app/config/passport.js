var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
var User = require("../modules/application/user/models/user.model");
var config = require("./index");
// Setup work and export for the JWT passport strategy
module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.configData.secretKey;
  passport.use(
    new JwtStrategy(opts, function(jwt_payload, done) {
      User.findOne({ _id: jwt_payload._doc._id }, function(err, user) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    })
  );
};
