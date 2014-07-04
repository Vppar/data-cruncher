var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var Type = requireHelper('entities/Type');

describe('Type entity', function () {

    it('should create an Type object', function (done) {
        expect(new Type({})).to.be.instanceof(Type);
        done();
    });

    it('should fail to create an Type object', function (done) {
        expect(function () {
            new Type();
        }).to.throw(Error);
        done();
    });
});