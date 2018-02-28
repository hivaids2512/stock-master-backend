var env = process.env.NODE_ENV || "development";
var configData = require('./env/' + env);

function getDbConnectionStr() {
  return (
    "mongodb://" +
    configData.db.username +
    ":" +
    configData.db.password +
    "@" +
    configData.db.host +
    ":" +
    configData.db.port +
    "/" +
    configData.db.database
  );
};

function getEndPoint() {
  var env = process.env.NODE_ENV || "development"
  return (
    domain[env]
  );
};

module.exports = {
  configData,
  getDbConnectionStr,
  getEndPoint
}