(function () {
  'use strict';

  var SessionController = require('../controllers/session');

  var sessionController = new SessionController();

  function SessionEndpoint() {

  }


  module.exports = SessionEndpoint;

  SessionEndpoint.prototype.create = function (req, res) {
    sessionController.create(req.body.email, req.body.password).then(function (token) {
      res.json(201, {token: token});
    }, function () {
      res.json(403, {message: 'Unauthorized'});
    });
  };

  SessionEndpoint.prototype.delete = function (req, res) {
    sessionController.delete(req.token).then(function () {
      res.json(200);
    }, function () {
      res.json(404, {message: 'Not found'});
    });
  };

})();
