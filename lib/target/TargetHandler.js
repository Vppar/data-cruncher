'use strict';

var Target = require('./Target.js');
var ArrayUtils = require('./../handlers/ArrayUtils.js');

function TargetHandler() {

  this.handlers = {};
  this.targets = [];
  var that = this;

  /**
   * Create the final target object and push it to the DataBase
   *
   * @param {event} - Object containing the nescessary data to create the target.
   */
  this.handlers.targetAddV1 = function (event) {
    event = new Target(event);
    that.targets.push(event);

    return event.uuid;
  };

  /**
   * Updates target object.
   *
   * @param {event} - Object to be updated.
   */
  this.handlers.targetUpdateV1 = function (event) {
    var oldTarget = ArrayUtils.find(that.targets, 'uuid', event.uuid);

    that.targets[that.targets.indexOf(oldTarget)] = event;

    return event.uuid;
  };
}

module.exports = TargetHandler;