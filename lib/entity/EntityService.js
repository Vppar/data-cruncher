'use strict';

var _ = require('underscore');
var Entity = require('./Entity.js');
var q = require('q');

function EntityService (entityInterface) {

  this.isValid = function (entity) {
    var invalidProperty = {};

    // just name and phone are mandatory
    invalidProperty.name = _.isUndefined(entity.name);
    invalidProperty.phones = _.isUndefined(entity.phones);

    var result = [];

    for ( var ix in invalidProperty) {
      if (invalidProperty[ix]) {
        // Create a new empty object, set a property
        // with the name of the invalid property,
        // fill it with the invalid value and add to
        // the result
        var error = {};
        error[ix] = entity[ix];
        result.push(error);
      }
    }

    return result;
  };

  /**
   * Returns the full entity list.
   *
   * @return Array - entity list.
   */
  this.list =
    function () {
      var result = null;
      try {
        result = entityInterface.list();
      } catch (err) {
       console.log('EntityService.list: Unable to recover the list of entity. Err=' +
            err);
      }
      return result;
    };

  /**
   * Returns a single entity by its id.
   *
   * @param uuid - Entity uuid.
   * @return Entity - The desired entity.
   */
  this.read =
    function (uuid) {
      var result = null;
      try {
        result = entityInterface.read(uuid);
      } catch (err) {
        console.log('EntityService.read: Unable to find a entity with id=\'' +
            uuid + '. Err=' + err);
      }
      return result;
    };

  /**
   * Create a entity in the datastore.
   *
   * @param entity - Entity object to be registered.
   * @return Array - Array of objects containing the invalid
   *         properties.
   * @throws Exception in case of a fatal error comming from
   *             the keeper.
   */
  this.create = function (entity) {
    var deferred = q.defer();
    var result = null;
    entity = new Entity(entity);
    var hasErrors = this.isValid(entity);
    if (hasErrors.length === 0) {
      result = entityInterface.create(entity);
    } else {
      result = deferred.reject(hasErrors);
    }
    return result;
  };

  /**
   *
   * Update values from entity
   *
   * @param Entity - Entity to be update.
   * @return Array - Array of objects containing the invalid
   *         properties.
   * @throws Exception in case of a fatal error comming from
   *             the keeper.
   */
  this.update =
    function (entity) {
      var result = this.isValid(entity);
      if (result.length === 0) {
        try {
          entity = new Entity(entity);
          return entityInterface.update(entity);
        } catch (err) {
          throw Error('EntityService.update: Unable to update a entity=' +
            JSON.stringify(entity) + '. Err=' + err);
        }
      }
      return result;
    };

    //I don't think this will be necessary on the server side.
//  this.listByBirthDate =
//    function (since, upon) {
//      var entitiesReturn = [];
//      var entitiesList = this.list();
//      if (entitiesList) {
//        for ( var idx in entitiesList) {
//          var entity = entitiesList[idx];
//          for ( var i = since.getFullYear(); i < upon.getFullYear() + 1; i++) {
//            if (verifyFilterByBirth(entity, since, upon, i)) {
//              if (jQuery.inArray(entity, entitiesReturn) === -1) {
//                entitiesReturn.push(entity);
//              }
//            }
//          }
//        }
//      }
//      return entitiesReturn;
//    };
//
//  function verifyFilterByBirth (entity, since, upon, yearCurrent) {
//    var birthDate = entity.birthDate;
//    if (birthDate && since && upon) {
//      var birthday =
//        new Date(
//          yearCurrent,
//            entity.birthDate.month - 1,
//          entity.birthDate.day);
//      birthday.setHours(0);
//      birthday.setMinutes(0);
//
//      if (birthday.getTime() >= since.getTime() &&
//        birthday.getTime() <= upon.getTime()) {
//        return true;
//      }
//
//    }
//    return false;
//  }
}

module.exports = EntityService;