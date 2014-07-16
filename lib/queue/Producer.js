'use strict';

function Producer(queue) {
  this.queue = queue;
}

Producer.prototype.enqueue = function (message) {
  this.queue.child('pending').put(message);
};