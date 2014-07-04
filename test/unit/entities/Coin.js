var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var Coin = requireHelper('entities/Coin');

describe('Coin entity', function () {

    it('should create an Coin object', function (done) {
        expect(new Coin({})).to.be.instanceof(Coin);
        done();
    });

    it('should fail to create an Coin object', function (done) {
        expect(function () {
            new Coin();
        }).to.throw(Error);
        done();
    });

});