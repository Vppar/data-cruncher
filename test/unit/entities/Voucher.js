var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var Voucher = requireHelper('entities/Voucher');

describe('Voucher entity', function () {

    it('should create an Voucher object', function (done) {
        expect(new Voucher({})).to.be.instanceof(Voucher);
        done();
    });

    it('should fail to create an Voucher object', function (done) {
        expect(function () {
            new Voucher();
        }).to.throw(Error);
        done();
    });
});