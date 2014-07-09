var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var ProductReturn = requireHelper('entities/ProductReturn');

describe('ProductReturn entity', function () {

    it('should create an ProductReturn object', function (done) {
        expect(new ProductReturn({})).to.be.instanceof(ProductReturn);
        done();
    });

    it('should create an ProductReturn object', function (done) {
        expect(new ProductReturn(1, 2, 3, 4, 1)).to.be.instanceof(ProductReturn);
        done();
    });

    it('should fail to create an ProductReturn object with an invalid field', function (done) {
        expect(function () {
            new ProductReturn({id:1, productId:1, documentId:2, quantity:2, wrongField:'test'});
        }).to.throw(Error);
        done();
    });

    it('should fail to create an ProductReturn object', function (done) {
        expect(function () {
            new ProductReturn();
        }).to.throw(Error);
        done();
    });
});