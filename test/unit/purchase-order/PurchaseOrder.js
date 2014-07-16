var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var purchaseOrderModule = requireHelper('purchase-order');

var PurchaseOrder = purchaseOrderModule.Entity;

describe('PurchaseOrder entity', function () {

    it('should create an PurchaseOrder object', function (done) {
        expect(new PurchaseOrder({})).to.be.instanceof(PurchaseOrder);
        done();
    });

    it('should create an PurchaseOrder object', function (done) {
        expect(new PurchaseOrder(1, 1, 2, 3, 2, 2)).to.be.instanceof(PurchaseOrder);
        done();
    });

    it('should fail to create an PurchaseOrder object with an invalid object', function (done) {
        expect(function () {
            new PurchaseOrder({uuid:1, created:1, amount:2, discount:3, points:2, invalid:2});
        }).to.throw(Error);
        done();
    });

    it('should fail to create an PurchaseOrder object', function (done) {
        expect(function () {
            new PurchaseOrder();
        }).to.throw(Error);
        done();
    });
});