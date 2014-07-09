'use strict';

var util = require('util');
var events = require('events');

var ObjectUtils = require('./ObjectUtils.js');
var Subscription = require('./../entities/Subscription.js');

function SubscriptionHandlers() {

  events.EventEmitter.call(this);
  var that = this;

  var subscriptions = [];
  this.subscriptions = subscriptions;
  this.handlers = {};

  ObjectUtils.ro(this.handlers, 'subscriptionAddV1', function (event) {
    event = new Subscription(event);

    subscriptions.push(event);

    that.emit('add', event);
    return event.uuid;
  });

  ObjectUtils.ro(this.handlers, 'nukeSubscriptionsV1', function () {
    subscriptions.length = 0;
    return true;
  });

}

util.inherits(SubscriptionHandlers, events.EventEmitter);

module.exports = SubscriptionHandlers;