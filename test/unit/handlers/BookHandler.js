var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var Book = requireHelper('entities/Book');
var BookEntry = requireHelper('entities/BookEntry');
var BookHandler = requireHelper('handlers/BookHandler');

describe('Book handler', function () {

    it('should create an instance of BookHandler object', function (done) {
        expect(new BookHandler()).to.be.instanceof(BookHandler);
        done();
    });

    it('should add a Book', function (done) {
        var bookHandler = new BookHandler();

        bookHandler.handlers.addBookV1(new Book({}));

        expect(bookHandler.books).to.have.length.above(0);
        done();
    });

    it('should write in a Book', function (done) {
        var bookHandler = new BookHandler();

        bookHandler.handlers.bookWriteV1(new BookEntry({}));

        expect(bookHandler.bookEntries).to.have.length.above(0);
        done();
    });

    it('should load a snapShot', function (done) {
        var bookHandler = new BookHandler();

        var snap = [];
        snap.push(new Book({}));
        snap.push(new Book({}));
        snap.push(new Book({}));

        bookHandler.handlers.snapBooksV1(snap);

        expect(bookHandler.books).to.have.length.above(0);
        done();
    });

    it('should nuke the Books', function (done) {
        var bookHandler = new BookHandler();

        bookHandler.handlers.addBookV1(new Book({}));

        bookHandler.handlers.nukeBooksV1();

        expect(bookHandler.books.length).to.eql(0);
        done();
    });

    it('should nuke the BookEntries', function (done) {
        var bookHandler = new BookHandler();

        bookHandler.handlers.addBookV1(new BookEntry({}));

        bookHandler.handlers.nukeEntriesV1();

        expect(bookHandler.bookEntries.length).to.eql(0);
        done();
    });
});