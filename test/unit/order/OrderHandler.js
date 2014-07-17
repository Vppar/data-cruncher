var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var orderModule = requireHelper('order');

var Order = orderModule.Entity;
var OrderHandler = orderModule.Handler;

describe('Order handler', function () {

    it('should create an instance of OrderHandler object', function (done) {
        expect(new OrderHandler()).to.be.instanceof(OrderHandler);
        done();
    });

    it('should add an Order', function (done) {
        var orderHandler = new OrderHandler();

        orderHandler.handlers.orderAddV1(new Order({}));

        expect(orderHandler.orders).to.have.length.above(0);
        done();
    });

    it('should cancel an Order', function (done) {
        var orderHandler = new OrderHandler();

        var order = new Order(1, 321, new Date(), null, 123123, []);

        orderHandler.handlers.orderAddV1(order);

        var canceledDate = new Date();

        orderHandler.handlers.orderCancelV1({uuid: 1, canceled: canceledDate});

        expect(orderHandler.orders[0].canceled).to.eql(canceledDate);
        done();
    });

    it('should fail to cancel an Order', function (done) {
        var orderHandler = new OrderHandler();

        expect(function () {
            orderHandler.handlers.orderCancelV1({uuid: 1});
        }).to.throw(Error);
        done();
    });

    it('should update an Order', function (done) {
        var orderHandler = new OrderHandler();

        var order = new Order(1, 321, new Date(), null, 123123, []);

        orderHandler.handlers.orderAddV1(order);

        orderHandler.handlers.orderUpdateV1({uuid: 1, items: ['item1', 'item2'], updated: new Date()});

        expect(orderHandler.orders[0].items.length).to.eql(2);
        done();
    });

    it('should fail update an Order', function (done) {
        var orderHandler = new OrderHandler();

        expect(function () {
            orderHandler.handlers.orderUpdateV1({uuid: 1});
        }).to.throw(Error);
        done();
    });

    it('should update the itemQty of an Order', function (done) {
        var orderHandler = new OrderHandler();

        var order = new Order(1, 321, new Date(), null, 123123, [{id:1, dQty:0}]);

        orderHandler.handlers.orderAddV1(order);

        orderHandler.handlers.orderUpdateItemQtyV1({uuid: 1, items: [{id:1,dQty:5}]});

        expect(orderHandler.orders[0].items[0].dQty).to.eql(5);
        done();
    });

    it('should update the itemQty of an Order that doesn\'t contain a dQty attribute', function (done) {
        var orderHandler = new OrderHandler();

        var order = new Order(1, 321, new Date(), null, 123123, [{id:1}]);

        orderHandler.handlers.orderAddV1(order);

        orderHandler.handlers.orderUpdateItemQtyV1({uuid: 1, items: [{id:1,dQty:5}]});

        expect(orderHandler.orders[0].items[0].dQty).to.eql(5);
        done();
    });

    it('should fail update an Order dQty', function (done) {
        var orderHandler = new OrderHandler();

        expect(function () {
            orderHandler.handlers.orderUpdateItemQtyV1({uuid: 1});
        }).to.throw(Error);
        done();
    });

    it('should nuke the Orders', function (done) {
        var orderHandler = new OrderHandler();

        orderHandler.handlers.orderAddV1(new Order({}));
        orderHandler.handlers.orderAddV1(new Order({}));
        orderHandler.handlers.orderAddV1(new Order({}));

        orderHandler.handlers.nukeOrdersV1(new Order({}));

        expect(orderHandler.orders.length).to.eql(0);
        done();
    });
});