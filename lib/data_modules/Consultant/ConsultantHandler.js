'use strict';

var _ = require('underscore');
var ArrayUtils = require('../../handlers/ArrayUtils.js');
var Consultant = require('./Consultant.js');

function ConsultantHandler() {

  this.consultants = [];
  this.handlers = {};
  var that = this;

// Nuke event for clearing the consultants list
  this.handlers.nukeConsultantsV1 = function () {
    that.consultants.length = 0;
    return true;
  };

  this.handlers.consultantCreateV1 = function (event) {
    event = new Consultant(event);
    that.consultants.push(event);

    return event.uuid;
  };

  this.handlers.consultantUpdateV1 = function (event) {
    var entry = ArrayUtils.find(that.consultants, 'uuid', event.uuid);
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

module.exports = ConsultantHandler;