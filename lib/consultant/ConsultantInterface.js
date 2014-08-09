'use strict';

var _ = require('underscore');
var ObjectUtils = require('../handlers/ObjectUtils.js');
var Consultant = require('./Consultant.js');
var MasterKeeper = require('../keepers/MasterKeeper.js');
var ArrayUtils = require('../handlers/ArrayUtils.js');

function ConsultantInterface(journalKeeper, consultantHandler) {

  var currentEventVersion = 1;

  ObjectUtils.superInvoke(this, journalKeeper, 'Consultant', Consultant, currentEventVersion);

  /**
   * create (Consultant)
   */
  this.create =
    function (consultant) {

      if (!(consultant instanceof Consultant)) {
        throw Error('Wrong instance to ConsultantKeeper');
      }

      var consultantObj = _.clone(consultant);

      return this.journalize('Create', consultantObj);
    };

  /**
   * update (consultant)
   */
    // FIXME - include an uuid check here also.
  this.update =
    function (consultant) {
      if (!(consultant instanceof Consultant)) {
        throw Error('Wrong instance to ConsultantKeeper');
      }

      var found = _.find(consultantHandler.consultants, function (entry) {
        return entry.uuid === consultant.uuid;
      });

      if (!found) {
        throw Error('Consultant uuid=' + consultant.uuid + ' not found!');
      }

      return this.journalize('Update', consultant);
    };

  this.list = function(){
    var consultants = [].concat(consultantHandler.consultants);
    return consultants;
  };

  this.read = function(uuid){
    var consultant = ArrayUtils.find(consultantHandler.consultants, 'uuid', uuid);
    return consultant;
  };
}

ObjectUtils.inherit(ConsultantInterface, MasterKeeper);

module.exports = ConsultantInterface;

