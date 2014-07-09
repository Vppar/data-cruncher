var Firebase = require('firebase');
var UserState = require('./lib/handlers/UserState.js');
var WorkQueue = require('./lib/thirdparty/workqueue.js');

var fbDev = new Firebase('https://voppwishlist.firebaseio.com/');

fbDev.auth("zDDGKRwrgxuJ2gpzMVK5I9h2gNDB4dFup7AW5nrh", function (error) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Login Succeeded!");
  }
});

var fbRoot = fbDev;

/*fbRoot.child('users').on('child_added', function(userRef){
 console.log(userRef.child('email').val());
 });*/

var users = ['wesleyakio@tuntscorp_com'];
var states = [];

for (var username in users) {
  states[username] = new UserState(fbRoot.child('users').child(username));
}

var subscriptionUpdateQueue = userRef.root().child('queues').child('pending').child('subscription-consultant-update');
new WorkQueue(subscriptionUpdateQueue, function (data, whenFinished) {

  var username = data.consultant.email.replace(/\.+/g, '_');

  if (state[username]) {
    state[username].interfaces.consultant.update({uuid: data.consultant.uuid, subscriptionExpirationDate: data.consultant.newSubscriptionExpirationDate});
  }

  whenFinished();
});