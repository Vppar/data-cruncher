'use strict';

var _ = require('underscore');
var Book = require('./../entities/Book.js');
var BookEntry = require('./../entities/BookEntry.js');

function BookHandler() {

    var books = [];
    var bookEntries = [];
    var currentCounter = 0;

    this.books = books;
    this.bookEntries = bookEntries;
    this.handlers = {};

    /**
     * AddBook
     */
    this.handlers.addBookV1 = function (event) {
        event = new Book(event);
        books.push(event);

        return event.uuid;
    };

    /**
     *
     * @param {Object} event
     * @return {Promise}
     */
    this.handlers.bookWriteV1 = function (event) {
        var entry = new BookEntry(event);
        bookEntries.push(entry);

        return entry;
    };

    /**
     * SnapBooks
     */
    this.handlers.snapBooksV1 = function (event) {
        var eventData = _.clone(event);
        books.length = 0;
        Array.prototype.unshift.apply(books, eventData);
        currentCounter = books.length;
    };
    /**
     * nukeBooks
     */
        // Nuke event for clearing the books list
    this.handlers.nukeBooksV1 = function () {
        books.length = 0;
        return true;
    };

    /**
     * nukeEntries
     */
        // Nuke event for clearing the books list
    this.handlers.nukeEntriesV1 = function () {
        bookEntries.length = 0;
        return true;
    };
}

module.exports = BookHandler;