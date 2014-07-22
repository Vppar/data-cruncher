'use strict';

var _ = require('underscore');
var ObjectUtils = require('../handlers/ObjectUtils.js');
var Check = require('./Check.js');
var MasterKeeper = require('../keepers/MasterKeeper.js');
var ArrayUtils = require('../handlers/ArrayUtils.js');
var q = require('q');

function CheckInterface(journalKeeper, checkHandler) {

  var currentEventVersion = 1;

  ObjectUtils.superInvoke(this, journalKeeper, 'Check', Check, currentEventVersion);

  /**
   * Adds a check to the list.
   *
   * @param check - Check object to be added.
   */
  this.add = function(check) {
    var deferred = q.defer();

    if (!(check instanceof Check)) {
      return deferred.reject('Wrong instance of Check');
    }

    var checkObj = _.clone(check);

    var event = new Check(checkObj);

    // save the journal entry
    return this.journalize('Add' ,event);
  };

  /**
   * Changes the state of a currently existing check.
   *
   * @param uuid - uuid of a check.
   * @param newState - the new state for the given check.
   */
  this.changeState = function(uuid, newState) {
    var deferred = q.defer();

    var check = ArrayUtils.find(checkHandler.checks, 'uuid', uuid);

    if (!check) {
      return deferred.reject('Couldn\'t find a check for the uuid: ' + uuid);
    }

    check.state = newState;

    return this.journalize('ChangeState' ,check);

  };
}

ObjectUtils.inherit(CheckInterface, MasterKeeper);

module.exports = CheckInterface;

