var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var subscriptionModule = requireHelper('subscription');

var Subscription = subscriptionModule.Entity;

describe('Subscription entity', function () {

    it('should create an Subscription object', function (done) {
        expect(new Subscription({})).to.be.instanceof(Subscription);
        done();
    });

    it('should create an Subscription object', function (done) {
        expect(new Subscription(2, 2, new Date(), 'test')).to.be.instanceof(Subscription);
        done();
    });

    it('should fail to create an Subscription object with an invalid field', function (done) {
        expect(function () {
            new Subscription({uuid:2, planType:2, subscriptionDate:new Date(), wrongField:'test'});
        }).to.throw(Error);
        done();
    });

    it('should fail to create an Subscription object', function (done) {
        expect(function () {
            new Subscription();
        }).to.throw(Error);
        done();
    });
});