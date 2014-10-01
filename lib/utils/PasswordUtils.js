(function () {
  'use strict';

  var crypto = require('crypto');
  var q = require('q');

  var config = require('../config');

  var PasswordUtils = exports;

  PasswordUtils.hash = function (password) {
    var salt = crypto.randomBytes(64).toString('base64');
    return derive(password, salt, config.PBKDF2_ITERATIONS).then(function(derivedKey){
      return createHashString(salt, config.PBKDF2_ITERATIONS, derivedKey);
    });
  };

  PasswordUtils.verify = function (password, hash) {

    var hashData = hash.replace('{X-PBKDF2}', '').split(':');
    return derive(password, hashData[0], Number(hashData[1])).then(function (newHash) {
      if (hashData[2] === newHash) {
        return true;
      } else {
        return q.reject('Passwords do not macth');
      }
    });
  };

  function createHashString(salt, iterations, hash) {
    var hashData = [];
    hashData.push(salt);
    hashData.push(iterations);
    hashData.push(hash);

    return '{X-PBKDF2}' + hashData.join(':');
  }

  function derive(password, salt, iterations) {
    var d = q.defer();

    crypto.pbkdf2(password, salt, iterations, 128, function (err, derivedKey) {
      if (err) {
        d.reject(err);
      } else {
        d.resolve(derivedKey.toString('base64'));
      }
    });

    return d.promise;
  }

})();
