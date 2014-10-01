(function () {
  'use strict';

  var parameters = require('../middlewares/parameters');

  var SessionEndpoint = require('../endpoints/session');
  var endpoint = new SessionEndpoint();

  module.exports = function sessionRoutes(app) {
    app
      .post('/core/session', [parameters({body : ['email', 'password']}), endpoint.create])
      .delete('/core/session', endpoint.delete);
  };
})();
