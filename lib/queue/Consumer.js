'use strict';

var WorkQueue = require('./workqueue');

function Consumer(queue, callback){
  var pending = queue.child('pending');
  var failed = queue.child('failed');

  new WorkQueue(pending, function(message, done){
    try {
      callback(message, done);
    } catch (e) {
      failed.push({originalMessage: message, error: e.message, fullError:JSON.stringify(e)});
    }
  });
}

module.exports = Consumer;