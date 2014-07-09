'use strict';

// Main variables
var Firebase = require('firebase');
var fbDev = new Firebase('https://voppwishlist.firebaseio.com/');
var fbRoot = fbDev;

var consultantUpdate = require("../mocks/consultant-update.json");

// Authenticate in firebase
fbDev.auth("zDDGKRwrgxuJ2gpzMVK5I9h2gNDB4dFup7AW5nrh", function (error) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    fbRoot.child('queues').child('subscription-consultant-update').child('pending').push(consultantUpdate, function(result){
      if(result){
        console.log("Subscription update error:" + result);
      } else {
        console.log("Subscription update requested.");
        process.exit(0);
      }
    });
  }
});
