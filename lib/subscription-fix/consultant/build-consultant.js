'use strict';

var ONE_WEEK = 1000 * 60 * 60 * 24 * 7;
var vpinkUUID = require('../vpink/vpink-uuid');
var subscription2Consultant = require('./subscription-2-consultant');

function buildConsultant(subscriptionData) {
  var consultant = subscription2Consultant(subscriptionData);

  var consultantUUID = vpinkUUID(1, 14, 1);
  consultant.uuid = consultantUUID;

  var subscriptionDate = subscriptionData.originalData.stamp;
  consultant.subscriptionExpirationDate = subscriptionDate + ONE_WEEK;

  return consultant;
}

module.exports = buildConsultant;