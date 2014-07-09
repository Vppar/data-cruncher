var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var Subscription = requireHelper('entities/Subscription');
var SubscriptionHandler = requireHelper('handlers/SubscriptionHandlers');

describe('Subscription handler', function () {

    it('should create an instance of SubscriptionHandler object', function (done) {
        expect(new SubscriptionHandler()).to.be.instanceof(SubscriptionHandler);
        done();
    });

    it('should add a new Subscription', function (done) {
        var subscriptionHandler = new SubscriptionHandler();

        subscriptionHandler.handlers.subscriptionAddV1(new Subscription({}));

        expect(subscriptionHandler.subscriptions).to.have.length.above(0);
        done();
    });

    it('should nuke all Subscription', function (done) {
        var subscriptionHandler = new SubscriptionHandler();

        subscriptionHandler.handlers.subscriptionAddV1(new Subscription({}));

        subscriptionHandler.handlers.nukeSubscriptionsV1();

        expect(subscriptionHandler.subscriptions.length).to.eql(0);
        done();
    });
});