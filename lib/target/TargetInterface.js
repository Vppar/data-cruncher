'use strict';

var _ = require('underscore');
var ObjectUtils = require('../handlers/ObjectUtils.js');
var Target = require('./Target.js');
var MasterKeeper = require('../keepers/MasterKeeper.js');
var q = require('q');

function TargetInterface(journalKeeper) {

  var currentEventVersion = 1;

  ObjectUtils.superInvoke(this, journalKeeper, 'Target', TargetInterface, currentEventVersion);

  /**
   * Adds a target to the list.
   *
   * @param target - target object to be added.
   */
  this.add = function (target) {

    var deferred = q.defer();

    if (!(target instanceof Target)) {
      return deferred.reject('Wrong instance of target');
    }

    var targetObj = _.clone(target);

    var event = new Target(targetObj);

    // save the journal entry
    return this.journalize(event);
  };

  /**
   * Updates a target.
   *
   * @param target - target object to be updated.
   */
  this.update = function (target) {

    var deferred = q.defer();

    if (!(target instanceof Target)) {
      return deferred.reject('Wrong instance of target');
    }

    var targetObj = _.clone(target);

    var event = new Target(targetObj);

    return this.journalize(event);
  };
}

ObjectUtils.inherit(TargetInterface, MasterKeeper);

module.exports = TargetInterface;