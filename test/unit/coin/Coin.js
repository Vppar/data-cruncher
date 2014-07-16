var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var coinModule = requireHelper('coin');

var Coin = coinModule.Entity;

describe('Coin entity', function () {

    it('should create an Coin object', function (done) {
        expect(new Coin({})).to.be.instanceof(Coin);
        done();
    });

    it('should create an Coin object', function (done) {
        expect(new Coin(1, new Date(), 2, 3, new Date())).to.be.instanceof(Coin);
        done();
    });

    it('should fail to create an Coin object with an invalid object', function (done) {
        expect(function () {
            new Coin({uuid:1, created:new Date(), entityId:2, amount:3, invalid:new Date()});
        }).to.throw(Error);
        done();
    });

    it('should fail to create an Coin object', function (done) {
        expect(function () {
            new Coin();
        }).to.throw(Error);
        done();
    });

});