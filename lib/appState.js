'use strict';

var Firebase = require('firebase');
var UserState = require('./handlers/UserState');

var data = require('./data');

function subscriptionUpdate(fbRoot) {
  fbRoot.child('users').on('child_added', function(val){
    data.states[val.name()] = new UserState(val.ref(), val);
  });
}

/*var fbDev = new Firebase('https://voppwishlist.firebaseio.com/');

fbDev.auth('zDDGKRwrgxuJ2gpzMVK5I9h2gNDB4dFup7AW5nrh', function (error) {
  if (error) {
    console.log('Login Failed!', error);
  } else {
    console.log('Login Succeeded!');
    subscriptionUpdate(fbDev);
  }
});*/

var fbProd = new Firebase('https://vopp.firebaseio.com/');

fbProd.auth('zhmVz7kUS7YBVUAbn4olhYaffVPA0n4nTCAb3WXe', function (error) {
  if (error) {
    console.log('Login Failed!', error);
  } else {
    console.log('Login Succeeded!');
    subscriptionUpdate(fbProd);
  }
});