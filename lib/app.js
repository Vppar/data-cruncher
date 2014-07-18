'use strict';

var pkg = require('../package.json');

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var routes = require('./routes');

//init app state
require('./appState');

function init() {
  var app = express();

  app.disable('x-powered-by');
  app.set('name', pkg.name);
  app.set('version', pkg.version);

  app.use(bodyParser.json());

  app.use(cors());

  routes(app);

  return app;
}

module.exports = init;
