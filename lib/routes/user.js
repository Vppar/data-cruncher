(function () {
  'use strict';

  var token = require('../middlewares/token');
  var authentication = require('../middlewares/authentication');

  var UserEndpoint = require('../endpoints/user');
  var endpoint = new UserEndpoint();

  module.exports = function sessionRoutes(app) {
    app
      .get('/core/user', [token(), authentication(), endpoint.list]);
  };
})();
