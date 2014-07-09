var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var Stock = requireHelper('entities/Stock');
var StockHandler = requireHelper('handlers/StockHandler');

describe('Stock handler', function () {

    it('should create an instance of StockHandler object', function (done) {
        expect(new StockHandler()).to.be.instanceof(StockHandler);
        done();
    });

    it('should add a new Stock', function (done) {
        var stockHandler = new StockHandler();

        stockHandler.handlers.stockAddV1(new Stock({}));

        expect(stockHandler.stock).to.have.length.above(0);
        done();
    });

    it('should add to an existing Stock', function (done) {
        var stockHandler = new StockHandler();

        stockHandler.handlers.stockAddV1(new Stock(1, 1, 2));

        stockHandler.handlers.stockAddV1(new Stock(1, 3, 2));

        expect(stockHandler.stock[0].quantity).to.eql(4);
        done();
    });

    it('should remove from a Stock', function (done) {
        var stockHandler = new StockHandler();

        stockHandler.handlers.stockAddV1(new Stock(1, 5, 2));

        stockHandler.handlers.stockRemoveV1(new Stock(1, 1, 2));

        expect(stockHandler.stock[0].quantity).to.eql(4);
        done();
    });

    it('should failt to remove from a Stock', function (done) {
        var stockHandler = new StockHandler();

        expect(function () {
            stockHandler.handlers.stockRemoveV1(new Stock({}));
        }).to.throw(Error);
        done();
    });

    it('should reserve from a Stock', function (done) {
        var stockHandler = new StockHandler();

        stockHandler.handlers.stockReserveV1({inventoryId: 1, reserve: 4});

        expect(stockHandler.stock[0].reserve).to.eql(4);
        done();
    });

    it('should unreserve from a Stock', function (done) {
        var stockHandler = new StockHandler();

        stockHandler.handlers.stockAddV1(new Stock(1, 5, 2));

        stockHandler.handlers.stockReserveV1({inventoryId: 1, reserve: 5});

        stockHandler.handlers.stockUnreserveV1({inventoryId: 1, reserve: 4});

        expect(stockHandler.stock[0].reserve).to.eql(1);
        done();
    });

    it('should fail tp unreserve from a Stock', function (done) {
        var stockHandler = new StockHandler();

        expect(function () {
            stockHandler.handlers.stockUnreserveV1({});
        }).to.throw(Error);
        done();
    });

    it('should nuke the Stock', function (done) {
        var stockHandler = new StockHandler();

        stockHandler.handlers.stockAddV1(new Stock({}));

        stockHandler.handlers.nukeStockV1();

        expect(stockHandler.stock.length).to.eql(0);
        done();
    });


});