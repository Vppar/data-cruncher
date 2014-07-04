var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var PurchaseOrder = requireHelper('entities/PurchaseOrder');
var PurchaseOrderHandler = requireHelper('handlers/PurchaseOrderHandler');

describe('PurchaseOrder handler', function () {

    it('should create an instance of PurchaseOrderHandler object', function (done) {
        expect(new PurchaseOrderHandler()).to.be.instanceof(PurchaseOrderHandler);
        done();
    });

    it('should add a PurchaseOrder', function (done) {
        var purchaseOrderHandler = new PurchaseOrderHandler();

        purchaseOrderHandler.handlers.purchaseOrderAddV1(new PurchaseOrder({}));

        expect(purchaseOrderHandler.purchases).to.have.length.above(0);
        done();
    });

    it('should add a PurchaseOrder', function (done) {
        var purchaseOrderHandler = new PurchaseOrderHandler();

        purchaseOrderHandler.handlers.purchaseOrderAddV1(new PurchaseOrder({}));

        expect(purchaseOrderHandler.purchases).to.have.length.above(0);
        done();
    });
});