(function () {
  'use strict';

  var fs = require('fs');
  var _ = require('underscore');

  /**
   * Route loader
   *
   * Scans the routes directory and loads all the files found. Beware it is not recursive.
   * @param app - The app :D
   */
  module.exports = function routes(app) {
    if (!app) {
      throw('Missing application');
    }

    var files = fs.readdirSync(__dirname);

    files.forEach(function (name) {
      if (name.substr(-3) === '.js' && name !== 'index.js') {

        var filename = './' + name;

        var route = require(filename);

        if (!_.isFunction(route)) {
          throw(require.resolve(filename) + ' is not a valid route file, Aborting');
        }

        route(app);
      }
    });
  };
})();
