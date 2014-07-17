var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var coinModule = requireHelper('coin');

var Coin = coinModule.Entity;
var CoinHandler = coinModule.Handler;

describe('Coin handler', function () {

    it('should create an instance of CoinHandler object', function (done) {
        expect(new CoinHandler('receivable')).to.be.instanceof(CoinHandler);
        done();
    });

    it('should add a Coin to the vault', function (done) {
        var coinHandler = new CoinHandler('receivable');

        coinHandler.handlers.receivableAddV1(new Coin({}));

        expect(coinHandler.vault).to.have.length.above(0);
        done();
    });

    it('should cancel a Coin', function (done) {
        var coinHandler = new CoinHandler('receivable');

        var coin = new Coin(1, new Date(), 2, 32, new Date());

        var uuid = coinHandler.handlers.receivableAddV1(coin);

        var canceledDate = new Date();

        coinHandler.handlers.receivableCancelV1({uuid: uuid, canceled: canceledDate});

        expect(coinHandler.vault[0].canceled).to.eql(canceledDate);
        done();
    });

    it('should fail to cancel a Coin', function (done) {
        var coinHandler = new CoinHandler('receivable');

        coinHandler.handlers.receivableAddV1(new Coin({}));

        expect(function () {
            coinHandler.handlers.receivableCancelV1({uuid: 0, canceled: null});
        }).to.throw(Error);
        done();
    });

    it('should liquidate a Coin', function (done) {
        var coinHandler = new CoinHandler('receivable');

        var coin = new Coin(1, new Date(), 2, 32, new Date());

        var uuid = coinHandler.handlers.receivableAddV1(coin);

        var liquidateDate = new Date();

        coinHandler.handlers.receivableLiquidateV1({uuid: uuid, liquidated: liquidateDate});

        expect(coinHandler.vault[0].liquidated).to.eql(liquidateDate);
        done();
    });

    it('should fail to liquidate a Coin', function (done) {
        var coinHandler = new CoinHandler('receivable');

        coinHandler.handlers.receivableAddV1(new Coin({}));

        expect(function () {
            coinHandler.handlers.receivableLiquidatelV1({uuid: 0, liquidated: null});
        }).to.throw(Error);
        done();
    });

    it('should update a receivale Coin', function (done) {
        var coinHandler = new CoinHandler('receivable');

        var coin = new Coin(1, new Date(), 2, 32, new Date());

        var uuid = coinHandler.handlers.receivableAddV1(coin);

        coin.amount = 7;

        coinHandler.handlers.updateReceivableV1(coin);

        expect(coinHandler.vault[0].amount).to.eql(7);
        done();
    });

    it('should fail to update a receivale Coin', function (done) {
        var coinHandler = new CoinHandler('receivable');

        var uuid = coinHandler.handlers.receivableAddV1(new Coin({}));

        expect(function () {
            coinHandler.handlers.updateReceivableV1({uuid:0});
        }).to.throw(Error);
        done();
    });

    it('should update a receivale payment', function (done) {
        var coinHandler = new CoinHandler('receivable');

        var coin = new Coin(1, new Date(), 2, 32, new Date());

        var uuid = coinHandler.handlers.receivableAddV1(coin);

        coin.payment = 18;

        coinHandler.handlers.receivableUpdatePaymentV1(coin);

        expect(coinHandler.vault[0].payment).to.eql(18);
        done();
    });

    it('should fail to update a receivale payment', function (done) {
        var coinHandler = new CoinHandler('receivable');

        var uuid = coinHandler.handlers.receivableAddV1(new Coin({}));

        expect(function () {
            coinHandler.handlers.receivableUpdatePaymentV1({uuid:0});
        }).to.throw(Error);
        done();
    });

    it('should nuke the vault', function (done) {
        var coinHandler = new CoinHandler('receivable');

        coinHandler.handlers.receivableAddV1(new Coin({}));
        coinHandler.handlers.receivableAddV1(new Coin({}));
        coinHandler.handlers.receivableAddV1(new Coin({}));

        coinHandler.handlers.nukeCoinsV1();

        expect(coinHandler.vault.length).to.eql(0);
        done();
    });

});