/**
 * Defines a middleware that extracts an access token from the request and
 * exposes its data for easier access.
 */

(function () {
  'use strict';

  var SessionController = require('../controllers/session');
  var sessionController = new SessionController();

  /**
   * Sets the `token` property in the request object.
   *
   * @param {Object} options Middleware configuration object. The following
   *  options are currently supported:
   *   - header {String} The name of the header containing the API Token.
   *   - property {String} The name of the property to be set in the 
   *      request object containing the token passed.
   *
   * @return {function(req, res, next)} A middleware function that
   *  checks for the presence of the token header and sets the `token`
   *  property in the request object.
   */
  exports = module.exports = function (options) {

    options = options || {};

    var header = options.header || 'token';
    var query = options.query || 'token';
    var property = options.property || 'session';

    if (!header && !query) {
      throw('Missconfigured: Unable to get a token from the request!');
    }

    return function (req, res, next) {
      var token = null;

      if (!token && header) {
        token = req.header && req.header[header] || null;
      }

      if (!token && query) {
        token = req.query && req.query[query] || null;
      }

      if (token) {
        req[property] = sessionController.get(token);
      }
      next();
    };
  };
})();
