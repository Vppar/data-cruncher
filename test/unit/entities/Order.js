var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var Order = requireHelper('entities/Order');

describe('Order entity', function () {

    it('should create an Order object', function (done) {
        expect(new Order({})).to.be.instanceof(Order);
        done();
    });

    it('should fail to create an Order object', function (done) {
        expect(function () {
            new Order();
        }).to.throw(Error);
        done();
    });
});