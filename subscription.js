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

state = new UserState(fbRoot.child('users').child('wesleyakio@tuntscorp_com'));


var subscriptionUpdateQueue = userRef.root().child('queues').child('pending').child('subscription-consultant-update').push(event);
new WorkQueue(subscriptionUpdateQueue, function(data, whenFinished){
    whenFinished();
});