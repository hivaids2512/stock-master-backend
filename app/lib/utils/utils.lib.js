var CONST = require("../../config/constant");
var download = require("download-file");
var AdmZip = require("adm-zip");
var moment = require("moment");
var fs = require("fs");

exports.downloadFile = function(url, options) {
  return new Promise(function(resolve, reject) {
    download(url, options, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(options.filename);
      }
    });
  });
};

exports.extractFileZip = function(filePath, destinationPath, options) {
  const zip = new AdmZip(filePath);
  zip.extractAllTo(destinationPath, true);
  return true;
};

exports.getLastestDatasetLink = function() {
  const currentDate = new Date();
  var dateToSubtract = 0;
  if (currentDate.getDay() == 6) {
    dateToSubtract = 1;
  } else if (currentDate.getDay() == 0) {
    dateToSubtract = 2;
  } else {
    dateToSubtract = 0;
  }
  //Example: http://images1.cafef.vn/data/20180301/CafeF.SolieuGD.Upto01032018.zip
  var datasetLink =
    CONST.DATASET_SOURCE +
    "/" +
    moment()
      .subtract(dateToSubtract, "day")
      .format("YYYYMMDD") +
    "/CafeF.SolieuGD.Upto" +
    moment()
      .subtract(dateToSubtract, "day")
      .format("DDMMYYYY") +
    ".zip";
  return datasetLink;
};

exports.getEndOfDateDatasetLink = function() {
  const currentDate = new Date();
  //Example: http://images1.cafef.vn/data/20180309/CafeF.SolieuGD.09032018.zip
  var datasetLink =
    CONST.DATASET_SOURCE +
    "/" +
    moment().format("YYYYMMDD") +
    "/CafeF.SolieuGD." +
    moment().format("DDMMYYYY") +
    ".zip";
  return datasetLink;
};
