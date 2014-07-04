var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var Appointment = requireHelper('entities/Appointment');

describe('Appointment entity', function () {

    it('should create an Appointment object', function (done) {
        expect(new Appointment({})).to.be.instanceof(Appointment);
        done();
    });

    it('should fail to create an Appointment object', function (done) {
        expect(function () {
            new Appointment();
        }).to.throw(Error);
        done();
    });

});