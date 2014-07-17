'use strict';

var _ = require('underscore');
var Book = require('./Book.js');
var BookEntry = require('./BookEntry.js');

function BookHandler() {

  var currentCounter = 0;

  this.books = [];
  this.bookEntries = [];
  this.handlers = {};
  var that = this;

  /**
   * AddBook
   */
  this.handlers.addBookV1 = function (event) {
    event = new Book(event);
    that.books.push(event);

    return event.uuid;
  };

  /**
   *
   * @param {Object} event
   * @return {Promise}
   */
  this.handlers.bookWriteV1 = function (event) {
    var entry = new BookEntry(event);
    that.bookEntries.push(entry);

    return entry;
  };

  /**
   * SnapBooks
   */
  this.handlers.snapBooksV1 = function (event) {
    var eventData = _.clone(event);
    that.books.length = 0;
    Array.prototype.unshift.apply(that.books, eventData);
    currentCounter = that.books.length;
  };
  /**
   * nukeBooks
   */
    // Nuke event for clearing the books list
  this.handlers.nukeBooksV1 = function () {
    that.books.length = 0;
    return true;
  };

  /**
   * nukeEntries
   */
    // Nuke event for clearing the books list
  this.handlers.nukeEntriesV1 = function () {
    that.bookEntries.length = 0;
    return true;
  };
}

module.exports = BookHandler;