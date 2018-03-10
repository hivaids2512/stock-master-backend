"use strict";
var async = require("async");
var CONST = require("../../config/constant");
var utils = require("../utils/utils.lib");
var fs = require("fs");
var loader = require("csv-load-sync");
var mongoose = require("mongoose");
var HnxModel = require("../../modules/data/statistic/models/hnx.model");
var HsxModel = require("../../modules/data/statistic/models/hsx.model");
var UpcomModel = require("../../modules/data/statistic/models/upcom.model");
var LineInputStream = require("line-input-stream");
var schedule = require("node-schedule");
var winston = require("winston");

const start = function(mode) {
  return new Promise(async function(resolve, reject) {
    try {
      var datasetLink = utils.getEndOfDateDatasetLink();
      if (mode == "all") {
        datasetLink = utils.getLastestDatasetLink();
      }
      const options = {
        directory: CONST.DOWNLOAD_DIRECTORY,
        filename: CONST.DATASET_FILE_NAME
      };
      //Download dataset
      winston.info("Downloading dataset from " + datasetLink);
      var downLoadResult = await utils.downloadFile(
        datasetLink,
        options
      );
      //Unzip it
      winston.info("Unziping dataset...");
      var unzipResult = utils.extractFileZip(
        CONST.DOWNLOAD_DIRECTORY + CONST.DATASET_FILE_NAME,
        CONST.DOWNLOAD_DIRECTORY,
        null
      );
      //Delete when unzip done
      if (unzipResult) {
        fs.unlinkSync(CONST.DOWNLOAD_DIRECTORY + CONST.DATASET_FILE_NAME);
      }
      fs.readdir(CONST.DOWNLOAD_DIRECTORY, async function(err, items) {
        var result = await readCsvAndSave(items);
      });
      resolve(true);
    } catch(err) {
      winston.error(err);
      reject(false);
    }
  });
};

const readCsvAndSave = function(files) {
  return new Promise(function(resolve, reject) {
    async.eachSeries(
      files,
      function(file, callback) {
        try {
          winston.info("Importing file" + file + "...");
          var stream = LineInputStream(
            fs.createReadStream(CONST.DOWNLOAD_DIRECTORY + file, { flags: "r" })
          );
          stream.setDelimiter("\n");
          var model;
          if (file.indexOf("HNX") != -1) {
            model = HnxModel;
          } else if (file.indexOf("HSX") != -1) {
            model = HsxModel;
          } else {
            model = UpcomModel;
          }
          var bulk = model.collection.initializeUnorderedBulkOp();
          var counter = 0;

          stream.on("error", function(err) {
            winston.error(err);
          });
          stream.on("line", function(line) {
            async.series(
              [
                function(callback) {
                  var row = line.split(",");
                  var obj = {}; // split the lines on delimiter
                  if (
                    row[0] &&
                    row[0] != undefined &&
                    row[0] != null &&
                    row[0] != ""
                  ) {
                    if (counter != 0) {
                      var obj = {
                        _id:
                          row[0] +
                          Math.floor(Math.random() * 100000 + 1) +
                          Math.floor(Math.random() * 1000000 + 1),
                        ticker: row[0],
                        date: row[1],
                        open: row[2],
                        high: row[3],
                        low: row[4],
                        close: row[5],
                        volume: row[6].trim()
                      };

                      // other manipulation

                      bulk.insert(obj); // Bulk is okay if you don't need schema
                      // defaults. Or can just set them.

                      counter++;

                      if (counter % CONST.BATCH_SIZE == 0) {
                        bulk.execute(function(err, result) {
                          if (err) throw err; // or do something
                          // possibly do something with result
                          var model;
                          if (file.indexOf("HNX") != -1) {
                            model = HnxModel;
                          } else if (file.indexOf("HSX") != -1) {
                            model = HsxModel;
                          } else {
                            model = UpcomModel;
                          }
                          bulk = model.collection.initializeUnorderedBulkOp();
                          callback();
                        });
                      } 
                    } else {
                      counter++;
                    }
                  }
                }
              ],
              function(err) {
                // each iteration is done
              }
            );
          });

          stream.on("end", function() {
            if (counter % CONST.BATCH_SIZE != 0)
              bulk.execute(function(err, result) {
                if (err) throw err; // or something
                // maybe look at result
                winston.info("Complete importing file" + file);
              });
          });
          callback();
        } catch (err) {
          winston.error(err);
        }
      },
      function(err) {
        if (err) {
          winston.error(err);
          reject(err);
        } else {
          resolve(true);
        }
      }
    );
  });
};

exports.start = start;

exports.scheduleDailyJob = function() {
  var rule = new schedule.RecurrenceRule();
  //From Monday to Friday at 23:00 pm
  rule.dayOfWeek = new schedule.Range(0,5);
  rule.hour = CONST.DAILY_TIME_TO_UPDATE_DATA;

  var j = schedule.scheduleJob(rule, function(){
    start("daily");
  });
}
