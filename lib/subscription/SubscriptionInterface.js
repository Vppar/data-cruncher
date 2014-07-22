'use strict';

var ObjectUtils = require('../handlers/ObjectUtils.js');
var Subscription = require('./Subscription.js');
var MasterKeeper = require('../keepers/MasterKeeper.js');
var q = require('q');

function SubscriptionInterface(journalKeeper) {

  var currentEventVersion = 1;

  ObjectUtils.superInvoke(this, journalKeeper, 'Subscription', Subscription, currentEventVersion);

  this.add = function (subscription) {

    var deferred = q.defer();

    if (!(subscription instanceof this.eventType)) {
      return deferred.reject('Wrong instance of Subscription');
    }

    return this.journalize('Add', subscription);
  };
}

ObjectUtils.inherit(SubscriptionInterface, MasterKeeper);

module.exports = SubscriptionInterface;