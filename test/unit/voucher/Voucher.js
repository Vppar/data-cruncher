var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var voucherModule = requireHelper('voucher');

var Voucher = voucherModule.Entity;

describe('Voucher entity', function () {

    it('should create an Voucher object', function (done) {
        expect(new Voucher({})).to.be.instanceof(Voucher);
        done();
    });

    it('should create an Voucher object', function (done) {
        expect(new Voucher(2, 3, 2, 1)).to.be.instanceof(Voucher);
        done();
    });

    it('should fail to create an Voucher object with an invalid parameter', function (done) {
        expect(function () {
            new Voucher({id:2, entity:3, type:2, invalid:1});
        }).to.throw(Error);
        done();
    });

    it('should fail to create an Voucher object', function (done) {
        expect(function () {
            new Voucher();
        }).to.throw(Error);
        done();
    });
});