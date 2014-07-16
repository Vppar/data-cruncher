var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var purchaseOrderModule = requireHelper('purchase-order');

var PurchaseOrder = purchaseOrderModule.Entity;
var PurchaseOrderHandler = purchaseOrderModule.Handler;

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

    it('should redeem an Order', function (done) {
        var purchaseOrderHandler = new PurchaseOrderHandler();

        var purchase = new PurchaseOrder(1, new Date(), 2, 0, 5, []);

        purchaseOrderHandler.handlers.purchaseOrderAddV1(purchase);

        purchaseOrderHandler.handlers.purchaseOrderRedeemV1({status:'', received:new Date(), uuid: 1, nfeNumber:123});

        expect(purchaseOrderHandler.purchases[0].status).to.eql(5);
        done();
    });

    it('should receive an Order', function (done) {
        var purchaseOrderHandler = new PurchaseOrderHandler();

        var purchase = new PurchaseOrder(1, new Date(), 2, 0, 5, []);

        purchaseOrderHandler.handlers.purchaseOrderAddV1(purchase);

        purchaseOrderHandler.handlers.purchaseOrderReceiveV1({status:'', received:new Date(), uuid: 1, nfeNumber:123});

        expect(purchaseOrderHandler.purchases[0].status).to.eql(4);
        done();
    });

    it('should update an Order', function (done) {
        var purchaseOrderHandler = new PurchaseOrderHandler();

        var purchase = new PurchaseOrder(1, new Date(), 2, 0, 5, []);

        purchaseOrderHandler.handlers.purchaseOrderAddV1(purchase);

        purchaseOrderHandler.handlers.purchaseOrderUpdateV2({updated: new Date(), amount:123, uuid: 1, discount:321, freight:0, points:0, items: [], cost: 0});

        expect(purchaseOrderHandler.purchases[0].discount).to.eql(321);
        done();
    });

    it('should update an Order status', function (done) {
        var purchaseOrderHandler = new PurchaseOrderHandler();

        var purchase = new PurchaseOrder(1, new Date(), 2, 0, 5, []);

        purchaseOrderHandler.handlers.purchaseOrderAddV1(purchase);

        var returnValue = purchaseOrderHandler.handlers.purchaseOrderChangeStatusV2({uuid: 1, status: 4, updated: new Date()});

        expect(returnValue).to.eql({ uuid: 1, from: 3, to: 4 });
        done();
    });

    it('should cancel an Order', function (done) {
        var purchaseOrderHandler = new PurchaseOrderHandler();

        var purchase = new PurchaseOrder(1, new Date(), 2, 0, 5, []);

        purchaseOrderHandler.handlers.purchaseOrderAddV1(purchase);

        var canceled = new Date();

        purchaseOrderHandler.handlers.purchaseOrderCancelV2({uuid:1, updated: new Date(), canceled : canceled});

        expect(purchaseOrderHandler.purchases[0].canceled).to.eql(canceled);
        done();
    });

    it('should nuke all Orders', function (done) {
        var purchaseOrderHandler = new PurchaseOrderHandler();

        purchaseOrderHandler.handlers.purchaseOrderAddV1({});
        purchaseOrderHandler.handlers.purchaseOrderAddV1({});
        purchaseOrderHandler.handlers.purchaseOrderAddV1({});
        purchaseOrderHandler.handlers.purchaseOrderAddV1({});

        purchaseOrderHandler.handlers.nukePurchasesV1();

        expect(purchaseOrderHandler.purchases.length).to.eql(0);
        done();
    });
});