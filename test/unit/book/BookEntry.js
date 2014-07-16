var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var bookModule = requireHelper('book');

var BookEntry = bookModule.Entry;

describe('BookEntry entity', function () {

    it('should create an BookEntry object', function (done) {
        expect(new BookEntry({})).to.be.instanceof(BookEntry);
        done();
    });

    it('should create an BookEntry object', function (done) {
        expect(new BookEntry(2, 4, 2, 1, 3, 2, 3, 2)).to.be.instanceof(BookEntry);
        done();
    });

    it('should fail to create an BookEntry object with an invalid object', function (done) {
        expect(function () {
            new BookEntry({uuid:2, created:4, debitAccount:2, creditAccount:1, document:3, entity:2, op:3, invalidField:2});
        }).to.throw(Error);
        done();
    });

    it('should fail to create an BookEntry object', function (done) {
        expect(function () {
            new BookEntry();
        }).to.throw(Error);
        done();
    });

});