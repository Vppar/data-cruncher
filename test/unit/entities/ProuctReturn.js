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

    it('should fail to create an ProductReturn object', function (done) {
        expect(function () {
            new ProductReturn();
        }).to.throw(Error);
        done();
    });
});