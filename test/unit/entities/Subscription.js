var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var Subscription = requireHelper('entities/Subscription');

describe('Subscription entity', function () {

    it('should create an Subscription object', function (done) {
        expect(new Subscription({})).to.be.instanceof(Subscription);
        done();
    });

    it('should fail to create an Subscription object', function (done) {
        expect(function () {
            new Subscription();
        }).to.throw(Error);
        done();
    });
});