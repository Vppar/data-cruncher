'use strict';

var ObjectUtils = require('./ObjectUtils.js');
var Subscription = require('./../entities/Subscription.js');

function SubscriptionHandler() {

    var subscriptions = [];
    this.subscriptions = subscriptions;
    this.handlers = {};


    ObjectUtils.ro(this.handlers, 'subscriptionAddV1', function (event) {
        event = new Subscription(event);

        subscriptions.push(event);
        return event.uuid;
    });

    ObjectUtils.ro(this.handlers, 'nukeSubscriptionsV1', function () {
        subscriptions.length = 0;
        return true;
    });

}

module.exports = SubscriptionHandler;