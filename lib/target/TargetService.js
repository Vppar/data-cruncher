'use strict';

var _ = require('underscore');
var Target = require('./Target.js');
var ArrayUtils = require('../handlers/ArrayUtils.js');
var q = require('q');

function TargetService(targetInterface) {

  // ###############################################################################################
  // Public methods
  // ###############################################################################################

  this.isValid =
    function(target) {
      var invalidProperty = {};

      invalidProperty.targets = !_.isUndefined(target.targets);
      invalidProperty.type = !_.isUndefined(target.type);
      invalidProperty.totalAmount = !_.isUndefined(target.totalAmount);
      invalidProperty.name = !_.isUndefined(target.name) && _.isString(target.name);

      var result = [];

      for ( var ix in invalidProperty) {
        if (!invalidProperty[ix]) {
          // Create a new empty object, set a
          // property
          // with the name of the invalid
          // property,
          // fill it with the invalid value and
          // add to
          // the result
          var error = {};
          error[ix] = target[ix];
          result.push(error);
        }
      }

      return result;
    };

  this.add = function(target) {
    var result = null;
    var deferred = q.defer();
    var hasErrors = this.isValid(target);

    if (hasErrors.length === 0) {
      var targetEntry = new Target(null ,target.targets, target.type, target.totalAmount, target.name);
      result = targetInterface.add(targetEntry);
    } else {
      result = deferred.reject('TargetService.add: -Invalid target. ', hasErrors);
    }
    return result;
  };

  this.update = function (target) {
    var result = null;
    var deferred = q.defer();
    var hasErrors = this.isValid(target);

    if (hasErrors.length === 0) {
      result = targetInterface.update(target);
    } else {
      result = deferred.reject('TargetService.update: -Invalid target. ', hasErrors);
    }
    return result;
  };

  this.findTarget = function(targetId) {
    var copyList = targetInterface.list();
    return ArrayUtils.find(copyList, 'uuid', targetId);
  };

  this.list = function() {
    return targetInterface.list();
  };

}

module.exports = TargetService;