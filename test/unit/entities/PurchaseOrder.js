var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var PurchaseOrder = requireHelper('entities/PurchaseOrder');

describe('PurchaseOrder entity', function () {

    it('should create an PurchaseOrder object', function (done) {
        expect(new PurchaseOrder({})).to.be.instanceof(PurchaseOrder);
        done();
    });

    it('should fail to create an PurchaseOrder object', function (done) {
        expect(function () {
            new PurchaseOrder();
        }).to.throw(Error);
        done();
    });
});