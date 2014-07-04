var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var Schedule = requireHelper('entities/Scheduling');

describe('Schedule entity', function () {

    it('should create an Schedule object', function (done) {
        expect(new Schedule({})).to.be.instanceof(Schedule);
        done();
    });

    it('should fail to create an Schedule object', function (done) {
        expect(function () {
            new Schedule();
        }).to.throw(Error);
        done();
    });
});