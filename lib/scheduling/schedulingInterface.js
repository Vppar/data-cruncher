'use strict';

var _ = require('underscore');
var ObjectUtils = require('../handlers/ObjectUtils.js');
var ArrayUtils = require('../handlers/ArrayUtils.js');
var Schedule = require('./Scheduling.js');
var MasterKeeper = require('../keepers/MasterKeeper.js');
var q = require('require');

function SchedulingInterface(journalKeeper, schedulingHandler) {

  var currentEventVersion = 1;

  ObjectUtils.superInvoke(this, journalKeeper, 'Schedule', Schedule, currentEventVersion);

  this.create = function create(schedule) {

    var deferred = q.defer();

    if (!(schedule instanceof Schedule)) {
      return deferred.reject('Wrong instance to SchedulingKeeper');
    }
    var scheduleObj = _.clone(schedule);

    var event = new Schedule(scheduleObj);

    // save the journal entry
    return this.journalize(event);
  };

  /**
   * Update an Scheduling
   */
  this.update =
    function update(uuid, date, items, status) {
      var schedule = ArrayUtils.find(schedulingHandler.schedulings, 'uuid', uuid);
      if (!schedule) {
        throw Error('Unable to find an schedule with uuid=\'' + uuid + '\'');
      }
      var updateEv = {
        uuid: uuid,
        date: date,
        updated: new Date().getTime(),
        items: items,
        status: status
      };

      return this.journalize(updateEv);
    };
}

ObjectUtils.inherit(SchedulingInterface, MasterKeeper);

module.exports = SchedulingInterface;