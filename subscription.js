'use strict';

var Firebase = require('firebase');
var UserState = require('./lib/handlers/UserState');
var WorkQueue = require('./lib/thirdparty/workqueue');

var consultantModule = require('./lib/consultant');

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

/*fbRoot.child('users').on('child_added', function(userRef){
 console.log(userRef.child('email').val());
 });*/

function subscriptionUpdate() {
  var users = ['arnaldo_rodrigues@tuntscorp_com', 'lucas_andrade@tuntscorp_com', 'rafael_andrade@tuntscorp_com', 'rennan_nogarotto@tuntscorp_com', 'wesleyakio@tuntscorp_com'];
  var states = {};

  for (var ix in users) {
    states[users[ix]] = new UserState(fbRoot.child('users').child(users[ix]));
  }

  var subscriptionUpdateQueue = fbRoot.child('queues').child('subscription-consultant-update').child('pending');
  new WorkQueue(subscriptionUpdateQueue, function (data, whenFinished) {

    var username = data.consultant.email.replace(/\.+/g, '_');

    if (states[username]) {
      try {
        var updatePromise = states[username].interfaces.consultant.update(new Consultant({uuid: data.consultant.uuid, subscriptionExpirationDate: data.consultant.newSubscriptionExpirationDate}));
        updatePromise.catch(function (error) {
          throw new Error(error);
        });
      } catch (e) {
        fbRoot.child('queues').child('subscription-consultant-update').child('failed').push({message: data, error: e.message});
      }

    } else {
      fbRoot.child('queues').child('subscription-consultant-update').child('failed').push({message: data, error: 'User does not have a state'});
    }

    whenFinished();
  });
}