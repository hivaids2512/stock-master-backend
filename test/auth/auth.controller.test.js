var expect = require("chai").expect;
var should = require("chai").should();
var request = require("request");
var utils = require("../utils");
var config = require("../../app/config");
var sampleUser;
var response;
var endPoint = config.getEndPoint();

describe("Authentication api test", function() {
  before(done => {
    utils.clearUserData(function(removed) {
      sampleUser = {
        email: "tranquy2512@gmail.com",
        password: "@Quy@%!@!((#"
      };
      done();
    });
  });

  describe("Register new user", function() {
    it("should return the status code 200", function(done) {
      request.post(
        {
          url: endPoint + "/api/signup",
          body: sampleUser,
          json: true,
          headers: { "content-type": "application/json" }
        },
        function(err, res, body) {
          expect(res.statusCode).to.equal(200);
          response = body;
          done();
        }
      );
    });
    it("should success is true", function(done) {
      expect(response.success).to.be.true;
      done();
    });
  });

  describe("Register with the same email", function() {
    it("should return the status code 200", function(done) {
      request.post(
        {
          url: endPoint + "/api/signup",
          body: sampleUser,
          json: true,
          headers: { "content-type": "application/json" }
        },
        function(err, res, body) {
          expect(res.statusCode).to.equal(200);
          response = body;
          done();
        }
      );
    });
    it("should success is false", function(done) {
      expect(response.success).to.be.false;
      done();
    });
  });

  describe("Authenticate with right email & password", function() {
    it("should return the status code 200", function(done) {
      request.post(
        {
          url: endPoint + "/api/signin",
          body: sampleUser,
          json: true,
          headers: { "content-type": "application/json" }
        },
        function(err, res, body) {
          expect(res.statusCode).to.equal(200);
          response = body;
          done();
        }
      );
    });
    it("should includes token", function(done) {
      expect(response).to.have.property("token");
      done();
    });
    it("should success is true", function(done) {
      expect(response.success).to.be.true;
      done();
    });
  });

  describe("Authenticate with wrong email & password", function() {
    it("should return the status code 200", function(done) {
      sampleUser = {
        email: "tranquys2512@gmail.com",
        password: "@Quy@%!@!((#"
      };
      request.post(
        {
          url: endPoint + "/api/signin",
          body: sampleUser,
          json: true,
          headers: { "content-type": "application/json" }
        },
        function(err, res, body) {
          expect(res.statusCode).to.equal(200);
          response = body;
          done();
        }
      );
    });
    it("should not includes token", function(done) {
      expect(response).to.not.have.property("token");
      done();
    });
    it("should success is false", function(done) {
      expect(response.success).to.be.false;
      done();
    });
  });

  describe("Authenticate with right email & wrong password", function() {
    it("should return the status code 200", function(done) {
      sampleUser = {
        email: "tranquy2512@gmail.com",
        password: "@Quy@%!@!((#123"
      };
      request.post(
        {
          url: endPoint + "/api/signin",
          body: sampleUser,
          json: true,
          headers: { "content-type": "application/json" }
        },
        function(err, res, body) {
          expect(res.statusCode).to.equal(200);
          response = body;
          done();
        }
      );
    });
    it("should content the error message", function(done) {
      expect(response.msg).to.equal("Authentication failed. Wrong password.");
      done();
    });
    it("should success is false", function(done) {
      expect(response.success).to.be.false;
      done();
    });
  });

  describe("Authenticate with wrong email & right password", function() {
    it("should return the status code 200", function(done) {
      sampleUser = {
        email: "tranquy2512@gmail.comz",
        password: "@Quy@%!@!((#"
      };
      request.post(
        {
          url: endPoint + "/api/signin",
          body: sampleUser,
          json: true,
          headers: { "content-type": "application/json" }
        },
        function(err, res, body) {
          expect(res.statusCode).to.equal(200);
          response = body;
          done();
        }
      );
    });
    it("should content the error message", function(done) {
      expect(response.msg).to.equal("Authentication failed. User not found.");
      done();
    });
    it("should success is false", function(done) {
      expect(response.success).to.be.false;
      done();
    });
  });
});
