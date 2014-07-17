'use strict';

var WorkQueue = require('./workqueue');
var _ = require('underscore');

/**
 * A Queue consumer to be used with Firebase
 *
 * @param {Firebase} queue - A [Firebase reference]{@link https://www.firebase.com/docs/javascript/firebase/index.html} to the queue
 * @param {Consumer~onMessageCallback} callback - The callback that will handle the message received from the Queue
 * @constructor
 */
function Consumer(queue, callback) {
  var pending = queue.child('pending');
  var failed = queue.child('failed');

  new WorkQueue(pending, function (message, done) {
    var doneCalled = false;

    function localDone() {
      if (!doneCalled) {
        doneCalled = true;
        done();
      }
    }

    try {
      var result = callback(message, localDone);

      // promise support(thenables actually)
      if (result.then && _.isFunction(result.then)) {
        result.then(null, function (error) {
          throw new Error(error);
        });
      }
    } catch (e) {
      failed.push({originalMessage: message, error: e.message, fullError: JSON.stringify(e)});
      localDone();
    }
  });
}

/**
 * The callback that will handle the message received from the Queue
 *
 * @callback Consumer~onMessageCallback
 * @param {Object} message - The message received from the queue
 * @param {Function} done - a function you must call to let the worker know that you're done
 */

module.exports = Consumer;