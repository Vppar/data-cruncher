var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var appointmentModule = requireHelper('appointment');

var Appointment = appointmentModule.Entity;

describe('Appointment entity', function () {

    it('should create an Appointment object', function (done) {
        expect(new Appointment({})).to.be.instanceof(Appointment);
        done();
    });

    it('should create an Appointment object', function (done) {
        expect(new Appointment(1, 3, 2, 1, 5, 1, 5,
            2, 2, 4, 9)).to.be.instanceof(Appointment);
        done();
    });

    it('should fail to create an Appointment object', function (done) {
        expect(function () {
            new Appointment({uuid:1, title:3, description:2, startDate:1, endDate:5, address:1, contacts:5,
                allDay:2, color:2, type:4, invalidField:9});
        }).to.throw(Error);
        done();
    });

    it('should fail to create an Appointment object', function (done) {
        expect(function () {
            new Appointment();
        }).to.throw(Error);
        done();
    });

});