var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var scheduleModule = requireHelper('scheduling');

var Schedule = scheduleModule.Entity;

describe('Schedule entity', function () {

    it('should create an Schedule object', function (done) {
        expect(new Schedule({})).to.be.instanceof(Schedule);
        done();
    });

    it('should create an Schedule object', function (done) {
        expect(new Schedule(5, 2, 2, new Date(), 1, [])).to.be.instanceof(Schedule);
        done();
    });

    it('should fail to create an Schedule object with an invalid parameter', function (done) {
        expect(function () {
            new Schedule({uuid:5, created:2, documentUUID:2, date:new Date(), status:1, invalid:[]});
        }).to.throw(Error);
        done();
    });

    it('should fail to create an Schedule object', function (done) {
        expect(function () {
            new Schedule();
        }).to.throw(Error);
        done();
    });
});