'use strict';

var _ = require('underscore');
var ObjectUtils = require('../handlers/ObjectUtils.js');

function Subscription(uuid, planType, subscriptionDate, consultant, paymentType, renewal) {

  var validProperties = [
    'uuid', 'planType', 'subscriptionDate', 'consultant', 'paymentType', 'renewal'
  ];

  ObjectUtils.method(Subscription, 'isValid', function () {
    for (var ix in this) {
      var prop = this[ix];
      if (!_.isFunction(prop)) {
        if (validProperties.indexOf(ix) === -1) {
          throw Error('Unexpected property ' + ix);
        }
      }
    }
  });

  if (arguments.length !== Subscription.length) {
    if (arguments.length === 1 && _.isObject(arguments[0])) {
      Subscription.prototype.isValid.apply(arguments[0]);
      ObjectUtils.dataCopy(this, arguments[0]);
    } else {
      throw Error('Subscription must be initialized with planType, subscriptionDate and consultant');
    }
  } else {
    this.uuid = uuid;
    this.planType = planType;
    this.subscriptionDate = subscriptionDate;
    this.consultant = consultant;
    this.paymentType = paymentType;
  }
}

module.exports = Subscription;