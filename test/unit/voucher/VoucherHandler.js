var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var voucherModule = requireHelper('voucher');

var Voucher = voucherModule.Entity;
var VoucherHandler = voucherModule.Handler;

describe('Voucher handler', function () {

    it('should create an instance of VoucherHandler object', function (done) {
        expect(new VoucherHandler()).to.be.instanceof(VoucherHandler);
        done();
    });

    it('should add a new Voucher', function (done) {
        var voucherHandler = new VoucherHandler();

        voucherHandler.handlers.voucherCreateV1(new Voucher( 1, 1, 'voucher', 20));

        expect(voucherHandler.voucher.voucher.length).to.eql(1);
        done();
    });

    it('should cancel a Voucher', function (done) {
        var voucherHandler = new VoucherHandler();

        voucherHandler.handlers.voucherCreateV1(new Voucher( 1, 1, 'voucher', 20));

        var canceled = new Date();

        voucherHandler.handlers.voucherCancelV1({id:1,type:'voucher', canceled:canceled});

        expect(voucherHandler.voucher.voucher[0].canceled).to.eql(canceled);
        done();
    });

    it('should fail to cancel a Voucher', function (done) {
        var voucherHandler = new VoucherHandler();

        expect(function(){
            voucherHandler.handlers.voucherCancelV1({id:1,type:'voucher'});
        }).to.throw(Error);
        done();
    });

    it('should redeem Voucher', function (done) {
        var voucherHandler = new VoucherHandler();

        voucherHandler.handlers.voucherCreateV1(new Voucher( 1, 1, 'voucher', 20));

        var redeemed = new Date();

        voucherHandler.handlers.voucherRedeemV1({id:1,type:'voucher', redeemed:redeemed, documentId:2});

        expect(voucherHandler.voucher.voucher[0].redeemed).to.eql(redeemed);
        done();
    });

    it('should fail to redeem Voucher', function (done) {
        var voucherHandler = new VoucherHandler();

        expect(function(){
            voucherHandler.handlers.voucherRedeemV1({id:9,type:'voucher'});
        }).to.throw(Error);
        done();
    });

    it('should nuke all Vouchers', function (done) {
        var voucherHandler = new VoucherHandler();

        voucherHandler.handlers.voucherCreateV1(new Voucher( 1, 1, 'voucher', 20));

        voucherHandler.handlers.nukeVouchersV1();

        expect(voucherHandler.voucher.voucher.length).to.eql(0);
        done();
    });
});
