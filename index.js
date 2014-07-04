var Firebase = require('firebase');
var OrderHandler = require('./lib/handlers/OrderHandler.js');
var UserState = require('./lib/handlers/UserState.js');

var fbDev = new Firebase('https://voppwishlist.firebaseio.com/');
var fbPrd = new Firebase('https://vopp.firebaseio.com/');

fbDev.auth("zDDGKRwrgxuJ2gpzMVK5I9h2gNDB4dFup7AW5nrh", function (error) {
    if (error) {
        console.log("Login Failed!", error);
    } else {
        console.log("Login Succeeded!");
    }
});

/*fbPrd.auth("zhmVz7kUS7YBVUAbn4olhYaffVPA0n4nTCAb3WXe", function (error) {
 if (error) {
 console.log("Login Failed!", error);
 } else {
 console.log("Login Succeeded!");
 }
 });*/

var journalRefs = [];

var fbRoot = fbDev;

/*fbRoot.child('users').on('child_added', function(userRef){
 console.log(userRef.child('email').val());
 });*/

var orderHandler = new OrderHandler();

var handlers = orderHandler.handlers;

//state = new UserState(fbRoot.child('users').child('arnaldo_rodrigues@tuntscorp_com'));
//state = new UserState(fbRoot.child('users').child('thiago_classen@tuntscorp_com'));
state = new UserState(fbRoot.child('users').child('wesleyakio@tuntscorp_com'));
