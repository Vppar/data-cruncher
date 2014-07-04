var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var Target = requireHelper('entities/Target');

describe('Target entity', function () {

    it('should create an Target object', function (done) {
        expect(new Target({})).to.be.instanceof(Target);
        done();
    });

    it('should fail to create an Target object', function (done) {
        expect(function () {
            new Target();
        }).to.throw(Error);
        done();
    });
});