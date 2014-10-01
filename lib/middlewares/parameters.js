(function () {
  'use strict';

  var _ = require('underscore');

  var HttpStatus = require('../enum/httpStatus');
  var RequestError = require('../enum/requestError');

  function getUndefinedParams(target, params) {
    if (!target || !params) {
      return null;
    }

    if (!Array.isArray(params)) {
      params = [params];
    }

    var missing = _.filter(params, function (param) {
      return _.isUndefined(target[param]);
    });

    return missing.length && missing || null;
  }


  function uselessMiddleware(req, res, next) {
    next();
  }


  module.exports = function (required) {
    if (!required) { return uselessMiddleware; }

    return function (req, res, next) {
      var key;
      var missing;

      for (key in required) {
        if (required.hasOwnProperty(key)) {
          missing = getUndefinedParams(req[key], required[key]);

          if (missing) {
            res.json(HttpStatus.BAD_REQUEST, {
              message : 'Missing parameters: ' + missing.join(', '),
              code : RequestError.MISSING_REQUIRED_PARAMETER
            });
            return;
          }
        }
      }

      next();
    };
  };
})();
