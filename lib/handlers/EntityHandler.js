'use strict';

var _ = require('underscore');
var ArrayUtils = require('./ArrayUtils.js');
var Entity = require('./../entities/Entity.js');

function EntityHandler() {

  this.entities = [];
  this.handlers = {};
  var that = this;

// Nuke event for clearing the entities list
  this.handlers.nukeEntitiesV1 = function () {
    that.entities.length = 0;
    return true;
  };

  this.handlers.entityCreateV1 = function (event) {
    event = new Entity(event);
    that.entities.push(event);

    return event.uuid;
  };

  this.handlers.entityUpdateV1 = function (event) {
    var entry = ArrayUtils.find(that.entities, 'uuid', event.uuid);

    if (entry !== null) {

      event = _.clone(event);
      delete event.uuid;
      _.extend(entry, event);

    } else {
      throw Error('User not found.');
    }

    return entry.uuid;
  };
}

module.exports = EntityHandler;