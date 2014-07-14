'use strict';

var ArrayUtils = require('./ArrayUtils.js');
var Check = require('./../entities/Check.js');

function CheckHandler() {

  this.checks = [];
  this.handlers = {};
  var that = this;

  /**
   * Create the final check object and push it to the DataBase
   *
   * @param {event} - Object containing the nescessary data to create
   *            the check.
   */
  this.handlers.checkAddV1 = function (event) {
    event = new Check(event);
    // Always create the check at state 1.
    event.state = 1;
    that.checks.push(event);

    return event.uuid;
  };

  /**
   * Get the check of the given uuid and replace the current state
   * with the new one.
   *
   * @param {event} - Object containing the uuid of the check and his
   *            new state.
   */
  this.handlers.checkChangeStateV1 = function (event) {

    var check = ArrayUtils.find(that.checks, 'uuid', event.uuid);
    check.state = event.state;

    return event.uuid;
  };
}

module.exports = CheckHandler;