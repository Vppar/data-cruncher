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

    it('should create an Book object', function (done) {
        expect(new Book(1, 2, 'asd', 2, 3, 3)).to.be.instanceof(Book);
        done();
    });

    it('should fail to create an Book object with an invalid object', function (done) {
        expect(function () {
            new Book({uuid:1, access:2, name:'', type:2, nature:2, invalidField:''});
        }).to.throw(Error);
        done();
    });

    it('should fail to create an Book object', function (done) {
        expect(function () {
            new Book();
        }).to.throw(Error);
        done();
    });
});