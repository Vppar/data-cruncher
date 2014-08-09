'use strict';

var _ = require('underscore');
var ObjectUtils = require('../handlers/ObjectUtils.js');
var Entity = require('./Entity.js');
var MasterKeeper = require('../keepers/MasterKeeper.js');
var ArrayUtils = require('../handlers/ArrayUtils.js');
var q = require('q');

function EntityInterface(journalKeeper, entityHandler) {

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


  this.read = function (uuid) {
    var entity = ArrayUtils.find(entityHandler.entities, 'uuid', uuid);
    return entity;
  };

  this.list = function () {
    var entity = [].concat(entityHandler.entities);
    return entity;
  };
}

ObjectUtils.inherit(EntityInterface, MasterKeeper);

module.exports = EntityInterface;