'use strict';

var WorkQueue = require('./workqueue');
var _ = require('underscore');

function Consumer(queue, callback) {
  var pending = queue.child('pending');
  var failed = queue.child('failed');

  new WorkQueue(pending, function (message, done) {
    var doneCalled = false;

    function localDone(){
      if(!doneCalled){
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

module.exports = Consumer;