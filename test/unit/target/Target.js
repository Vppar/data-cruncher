var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var targetModule = requireHelper('target');

var Target = targetModule.Entity;

describe('Target entity', function () {

    it('should create an Target object', function (done) {
        expect(new Target({})).to.be.instanceof(Target);
        done();
    });

    it('should create an Target object', function (done) {
        expect(new Target(5, 1, 2, 2, '')).to.be.instanceof(Target);
        done();
    });

    it('should fail to create an Target object with an invalid parameter', function (done) {
        expect(function () {
            new Target({uuid:5, targets:1, type:2, totalAmount:2, invalid:''});
        }).to.throw(Error);
        done();
    });

    it('should fail to create an Target object', function (done) {
        expect(function () {
            new Target();
        }).to.throw(Error);
        done();
    });
});