var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var Stock = requireHelper('entities/Stock');

describe('Stock entity', function () {

    it('should create an Stock object', function (done) {
        expect(new Stock({})).to.be.instanceof(Stock);
        done();
    });

    it('should fail to create an Stock object', function (done) {
        expect(function () {
            new Stock();
        }).to.throw(Error);
        done();
    });
});