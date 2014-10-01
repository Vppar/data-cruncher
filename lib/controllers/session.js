(function () {
  'use strict';

  var PasswordUtils = require('../utils/PasswordUtils');
  var config = require('../config');
  var data = require('../data');
  var uuid = require('node-uuid');
  var crypto = require('crypto');
  var q = require('q');

  function SessionController() {

  }

  module.exports = SessionController;

  SessionController.prototype.create = function (username, password) {
    var user = '_' + crypto.createHash('sha256').update(username).digest('hex');

    var hash = data.users[user] && data.users[user].hash;

    if (!hash) {
      return q.reject('User not found');
    }
    return PasswordUtils.verify(password, hash).then(function () {
      var token = uuid.v4();
      data.tokens['_' + token] = {
        expiration: new Date().getTime() + config.SESSION_LIMIT * 1000,
        owner: user
      };
      return token;
    });
  };

  SessionController.prototype.get = function (token) {
    if (data.tokens['_' + token] && data.tokens['_' + token].expiration > new Date().getTime()) {
      return data.tokens['_' + token];
    } else {
      return null;
    }
  };

})();