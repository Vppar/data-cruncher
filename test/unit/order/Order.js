var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var orderModule = requireHelper('order');

var Order = orderModule.Entity;

describe('Order entity', function () {

    it('should create an Order object', function (done) {
        expect(new Order({})).to.be.instanceof(Order);
        done();
    });

    it('should create an Order object', function (done) {
        expect(new Order(1, 2, new Date(), 2, 2, 3)).to.be.instanceof(Order);
        done();
    });

    it('should fail to create an Order object', function (done) {
        expect(function () {
            new Order({uuid:1, code:2, date:new Date(), canceled:2, customerId:2, invalid:3});
        }).to.throw(Error);
        done();
    });

    it('should fail to create an Order object', function (done) {
        expect(function () {
            new Order();
        }).to.throw(Error);
        done();
    });
});