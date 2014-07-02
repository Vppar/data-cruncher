var _ = require('underscore');
var ObjectUtils = require('./ObjectUtils.js');
var Book = require('./../entities/Book.js');
var BookEntry = require('./../entities/BookEntry.js');

function BookHandler() {

    var type = 8;
    var books = [];
    var bookEntries = [];
    var currentCounter = 0;
    var entryType = 9;
    var entryCurrentCounter = 0;

    this.books = books;
    this.bookEntries = bookEntries;
    this.handlers = {};

    function getNextId() {
        return ++currentCounter;
    }

    function getEntryNextId() {
        return ++entryCurrentCounter;
    }

    /**
     * AddBook
     */
    ObjectUtils.ro(this.handlers, 'addBookV1', function (event) {
        var eventData = IdentityService.getUUIDData(event.uuid);

        if (eventData.deviceId === IdentityService.getDeviceId()) {
            currentCounter = currentCounter >= eventData.id ? currentCounter : eventData.id;
        }

        event = new Book(event);
        books.push(event);

        return event.uuid;
    });

    /**
     *
     * @param {Object} event
     * @return {Promise}
     */
    ObjectUtils.ro(this.handlers, 'bookWriteV1', function (event) {

        var uuidData = IdentityService.getUUIDData(event.uuid);

        if (uuidData.deviceId === IdentityService.getDeviceId()) {
            entryCurrentCounter = entryCurrentCounter >= uuidData.id ? entryCurrentCounter : uuidData.id;
        }

        var entry = new BookEntry(event);
        bookEntries.push(entry);

        return entry;
    });

    /**
     * SnapBooks
     */
    ObjectUtils.ro(this.handlers, 'snapBooksV1', function (event) {
        var eventData = angular.copy(event);
        books.length = 0;
        books = eventData;
        currentCounter = books.length;
    });
    /**
     * nukeBooks
     */
        // Nuke event for clearing the books list
    ObjectUtils.ro(this.handlers, 'nukeBooksV1', function () {
        books.length = 0;
        return true;
    });

    /**
     * nukeBooks
     */
        // Nuke event for clearing the books list
    ObjectUtils.ro(this.handlers, 'nukeEntriesV1', function () {
        bookEntries.length = 0;
        return true;
    });
}

module.exports = BookHandler;