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

    it('should create an Check object', function (done) {
        expect(new Check(2, 1, 4, 1, 2, new Date(), 2)).to.be.instanceof(Check);
        done();
    });

    it('should fail to create an Check object with an invalid object', function (done) {
        expect(function () {
            new Check({uuid:2, bank:1, agency:4, account:1, number:2, duedate:new Date(), invalid:2});
        }).to.throw(Error);
        done();
    });

    it('should fail to create an Check object', function (done) {
        expect(function () {
            new Check();
        }).to.throw(Error);
        done();
    });

});