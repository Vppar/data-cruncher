'use strict';

var _ = require('underscore');
var ObjectUtils = require('../handlers/ObjectUtils.js');
var Entity = require('./Entity.js');
var MasterKeeper = require('../keepers/MasterKeeper.js');
var q = require('q');

function EntityInterface(journalKeeper) {

  var currentEventVersion = 1;

  ObjectUtils.superInvoke(this, journalKeeper, 'Entity', Entity, currentEventVersion);

  /**
   * create (Entity)
   */
  this.create = function (entity) {

      var deferred = q.defer();

      if (!(entity instanceof Entity)) {
        return deferred.reject('Wrong instance to EntityKeeper');
      }

      var entityObj = _.clone(entity);

      var event = new Entity(entityObj);

      return this.journalize('Create', event);
    };

  /**
   * update (Entity)
   */
    //FIXME - include an uuid check here also.
  this.update =
    function (entity) {

      var deferred = q.defer();

      if (!(entity instanceof Entity)) {
        return deferred.reject('Wrong instance to EntityKeeper');
      }

      return this.journalize(entity);
    };
}

ObjectUtils.inherit(EntityInterface, MasterKeeper);

module.exports = EntityInterface;