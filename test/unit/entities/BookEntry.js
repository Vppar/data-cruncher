var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var BookEntry = requireHelper('entities/BookEntry');

describe('BookEntry entity', function () {

    it('should create an BookEntry object', function (done) {
        expect(new BookEntry({})).to.be.instanceof(BookEntry);
        done();
    });

    it('should fail to create an BookEntry object', function (done) {
        expect(function () {
            new BookEntry();
        }).to.throw(Error);
        done();
    });

});