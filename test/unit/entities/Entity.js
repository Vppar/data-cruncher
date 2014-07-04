var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var Book = requireHelper('entities/Book');

describe('Book entity', function () {

    it('should create an Book object', function (done) {
        expect(new Book({})).to.be.instanceof(Book);
        done();
    });

    it('should fail to create an Book object', function (done) {
        expect(function () {
            new Book();
        }).to.throw(Error);
        done();
    });
});