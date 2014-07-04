var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var Check = requireHelper('entities/Check');

describe('Check entity', function () {

    it('should create an Check object', function (done) {
        expect(new Check({})).to.be.instanceof(Check);
        done();
    });

    it('should fail to create an Check object', function (done) {
        expect(function () {
            new Check();
        }).to.throw(Error);
        done();
    });

});