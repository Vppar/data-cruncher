'use strict';


function SubscriptionTools() {
  var q = require('q');
  var buildConsultant = require('./build-consultant');

  this.getSubscriptionData = function (userRef) {
    var deferred = q.defer();
    var subscriptionDataRef = userRef.child('account').child('consultant');
    subscriptionDataRef.once('value', function (nameSnapshot) {
      var subscriptionData = nameSnapshot.val();
      console.log(userRef.name(), subscriptionData);
      if (subscriptionData) {
        deferred.resolve(subscriptionData);
      } else {
        var name = userRef.name();
        deferred.reject('No subscription data found:', name);
      }
    });
    return deferred.promise;
  };

  this.convert2Consultant = buildConsultant;

}
module.exports = SubscriptionTools;