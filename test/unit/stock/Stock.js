var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var stockModule = requireHelper('stock');

var Stock = stockModule.Entity;

describe('Stock entity', function () {

    it('should create an Stock object', function (done) {
        expect(new Stock({})).to.be.instanceof(Stock);
        done();
    });

    it('should create an Stock object', function (done) {
        expect(new Stock(4, 2, 2)).to.be.instanceof(Stock);
        done();
    });

    it('should fail to create an Stock object with an invalid parameter', function (done) {
        expect(function () {
            new Stock({inventoryId:4, quantity:2, invalid:2});
        }).to.throw(Error);
        done();
    });

    it('should fail to create an Stock object', function (done) {
        expect(function () {
            new Stock();
        }).to.throw(Error);
        done();
    });
});