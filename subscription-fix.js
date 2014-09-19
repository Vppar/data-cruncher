'use strict';

var Firebase = require('firebase');
var UserState = require('./lib/handlers/UserState');
var WorkQueue = require('./lib/thirdparty/workqueue');

var consultantModule = require('./lib/consultant');
var SubscriptionReaper = require('./lib/subscription-fix/subcription/subscription-reaper');
var subscriptionReaper = new SubscriptionReaper();

var Consultant = consultantModule.Entity;

var fbDev = new Firebase('https://voppwishlist.firebaseio.com/');

fbDev.auth("zDDGKRwrgxuJ2gpzMVK5I9h2gNDB4dFup7AW5nrh", function (error) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Login Succeeded!");
    subscriptionUpdate();
  }
});

var fbRoot = fbDev;

function subscriptionUpdate() {
  var states = {};

  fbRoot.child('users').on('child_added', function (userRef) {
    var childAdded = userRef.name();
    console.log('Child added', childAdded);

    states[childAdded] = new UserState(fbRoot.child('users').child(childAdded));
  });

  var subscriptionUpdateQueue = fbRoot.child('queues').child('subscription-consultant-fix').child('pending');
  new WorkQueue(subscriptionUpdateQueue, function (data, whenFinished) {

    if (data.consultant && data.consultant.email) {

      var username = data.consultant.email.replace(/\.+/g, '_');

      if (states[username]) {
        try {
          var updatePromise = states[username].interfaces.consultant.update(new Consultant({
            uuid: data.consultant.uuid,
            subscriptionExpirationDate: data.consultant.newSubscriptionExpirationDate
          }));
          updatePromise.catch(function (error) {
            throw new Error(error);
          });
        } catch (e) {
          if (e.message && e.message.indexOf('not found') > -1) {
            subscriptionReaper.getSubscriptionData(fbRoot.child('users').child(username)).then(function (subscriptionData) {
              var consultant = subscriptionReaper.convert2Consultant(subscriptionData);
              if (data.consultant.newSubscriptionExpirationDate) {
                consultant.subscriptionExpirationDate = data.consultant.newSubscriptionExpirationDate;
              }
              var createPromise = states[username].interfaces.consultant.create(new Consultant(consultant));
              createPromise.catch(function (error) {
                throw new Error(error);
              }, function (err) {
                console.log(err);
              });
            });
          } else {
            fbRoot.child('queues').child('subscription-consultant-fix').child('failed').push({message: data, error: e.message});
          }
        }

      } else {
        fbRoot.child('queues').child('subscription-consultant-fix').child('failed').push({
          message: data,
          error: 'User does not have a state'
        });
      }
    } else {
      fbRoot.child('queues').child('subscription-consultant-fix').child('failed').push({
        message: data,
        error: 'Unable to identify the user'
      });
    }
    whenFinished();
  });
}