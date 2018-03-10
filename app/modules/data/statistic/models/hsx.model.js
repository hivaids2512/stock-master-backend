var mongoose = require("mongoose");
var bcrypt = require('bcrypt');

// Schema defines how the user data will be stored in MongoDB
var HsxtSchema = new mongoose.Schema({
  ticker: {
    type: String
  },
  date: {
    type: String
  },
  open: {
    type: Number
  },
  high: {
    type: Number
  },
  low: {
    type: Number
  },
  close: {
    type: Number
  },
  volume: {
    type: Number,
  }
});

module.exports = mongoose.model("Hsx", HsxtSchema);
