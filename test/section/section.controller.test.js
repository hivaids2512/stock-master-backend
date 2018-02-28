var expect = require("chai").expect;
var should = require("chai").should();
var request = require("request");
var utils = require("../utils");
var config = require("../../app/config");
var Resume = require("../../app/modules/section/section.model");
var sampleSection;
var sectionList;
var endPoint = config.getEndPoint();
var token;
var resumeId;

describe("Section api test", function() {
  before(done => {
    resumeId = "59931d316d437903b0dcc364";
    utils.clearData(function(removed) {
      sampleSection = {
        title: "Section 1",
        description: "Section 1",
        content: "Section 1",
        resume: resumeId
      };
      utils.getToken(function(err, accessToken) {
        token = accessToken;
        done();
      });
    });
  });

  describe("Create section testing", function() {
    it("should return the status code 200", function(done) {
      request.post(
        {
          url: endPoint + "/api/resumes/" + resumeId + "/sections",
          body: sampleSection,
          json: true,
          headers: { "content-type": "application/json", Authorization: token }
        },
        function(err, res, body) {
          expect(res.statusCode).to.equal(200);
          sampleSection = body;
          done();
        }
      );
    });
    it("should return created section", function(done) {
      expect(sampleSection.title).to.equal("Section 1");
      done();
    });
  });

  describe("Edit section testing", function() {
    it("should return the status code 200", function(done) {
      sampleSection.title = "Edited";
      sampleSection.description = "Edited";
      request.put(
        {
          url:
            endPoint +
            "/api/resumes/" +
            resumeId +
            "/sections/" +
            sampleSection._id,
          body: sampleSection,
          json: true,
          headers: { "content-type": "application/json", Authorization: token }
        },
        function(err, res, body) {
          expect(res.statusCode).to.equal(200);
          sampleSection = body;
          done();
        }
      );
    });
    it("should return updated resume", function(done) {
      expect(sampleSection.title).to.equal("Edited");
      done();
    });
  });

  describe("Get resume list testing", function() {
    before(function(done) {
      var newSection = {
        title: "Section 2",
        description: "Section 2",
        content: "Section 2",
        resume: "59931d316d437903b0dcc364"
      };
      request.post(
        {
          url: endPoint + "/api/resumes/" + resumeId + "/sections",
          body: newSection,
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
          url: endPoint + "/api/resumes/" + resumeId + "/sections",
          json: true,
          headers: { Authorization: token }
        },
        function(err, res, body) {
          expect(res.statusCode).to.equal(200);
          sectionList = body;
          done();
        }
      );
    });
    it("should return 2 sections", function(done) {
      expect(sectionList.length).to.equal(2);
      done();
    });
  });

  describe("Delete section testing", function() {
    it("should return the status code 200", function(done) {
      request.delete(
        {
          url:
            endPoint +
            "/api/resumes/" +
            resumeId +
            "/sections/" +
            sampleSection._id,
          json: true,
          headers: { "content-type": "application/json", Authorization: token }
        },
        function(err, res, body) {
          expect(res.statusCode).to.equal(200);
          sampleSection = body;
          done();
        }
      );
    });
    it("should return correct payload", function(done) {
      expect(sampleSection.ok).to.equal(1);
      done();
    });
  });

  after(done => {
    utils.clearData(function(removed) {
      done();
    });
  });
});
