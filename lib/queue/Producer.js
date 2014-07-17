'use strict';

/**
 * A Queue producer to be used with Firebase
 *
 * @param {Firebase} queue - A [Firebase reference]{@link https://www.firebase.com/docs/javascript/firebase/index.html} to the queue
 * @constructor
 */
function Producer(queue) {
  this.queue = queue;
}

/**
 * Inserts a message in the queue
 *
 * @param {Object} message - the message the will be inserted in the queue
 */
Producer.prototype.enqueue = function (message) {
  this.queue.child('pending').put(message);
};