var expect = require("chai").expect;
var should = require("chai").should();
var request = require("request");
var utils = require("../utils");
var config = require("../../app/config");
var Resume = require("../../app/modules/resume/resume.model");
var sampleResume;
var resumeList;
var endPoint = config.getEndPoint();
var token;

describe("Resume api test", function() {
  before(done => {
    utils.clearData(function(removed) {
      sampleResume = {
        name: "Test 2",
        description: "Test 2"
      };
      utils.getToken(function(err, accessToken) {
        token = accessToken;
        done();
      });
    });
  });

  describe("Create resume testing", function() {
    it("should return the status code 200", function(done) {
      request.post(
        {
          url: endPoint + "/api/resumes",
          body: sampleResume,
          json: true,
          headers: { "content-type": "application/json", Authorization: token }
        },
        function(err, res, body) {
          expect(res.statusCode).to.equal(200);
          sampleResume = body;
          done();
        }
      );
    });
    it("should return created resume", function(done) {
      expect(sampleResume.name).to.equal("Test 2");
      done();
    });
  });

  describe("Edit resume testing", function() {
    it("should return the status code 200", function(done) {
      sampleResume.name = "Edited";
      sampleResume.description = "Edited";
      request.put(
        {
          url: endPoint + "/api/resumes/" + sampleResume._id,
          body: sampleResume,
          json: true,
          headers: { "content-type": "application/json", Authorization: token }
        },
        function(err, res, body) {
          expect(res.statusCode).to.equal(200);
          sampleResume = body;
          done();
        }
      );
    });
    it("should return updated resume", function(done) {
      expect(sampleResume.name).to.equal("Edited");
      done();
    });
  });

  describe("Get resume list testing", function() {
    before(function(done) {
      var newResume = { name: "test1", description: "des test1" };
      request.post(
        {
          url: endPoint + "/api/resumes",
          body: newResume,
          json: true,
          headers: { "content-type": "application/json", Authorization: token }
        },
        function(err, res, body) {
          done();
        }
      );
    });

    it("should return the status code 200", function(done) {
      request.get(
        {
          url: endPoint + "/api/resumes",
          json: true,
          headers: { Authorization: token }
        },
        function(err, res, body) {
          expect(res.statusCode).to.equal(200);
          resumeList = body;
          done();
        }
      );
    });
    it("should return 2 resumes", function(done) {
      expect(resumeList.length).to.equal(2);
      done();
    });
  });

  describe("Delete resume testing", function() {
    it("should return the status code 200", function(done) {
      request.delete(
        {
          url: endPoint + "/api/resumes/" + sampleResume._id,
          body: sampleResume,
          json: true,
          headers: { "content-type": "application/json", Authorization: token }
        },
        function(err, res, body) {
          expect(res.statusCode).to.equal(200);
          sampleResume = body;
          done();
        }
      );
    });
    it("should return correct payload", function(done) {
      expect(sampleResume.ok).to.equal(1);
      done();
    });
  });

  after(done => {
    utils.clearData(function(removed) {
      done();
    });
  });
});
