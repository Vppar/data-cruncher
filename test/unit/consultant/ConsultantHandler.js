var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var consultantModule = requireHelper('consultant');

var Consultant = consultantModule.Entity;
var ConsultantHandler = consultantModule.Handler;

describe('consultant handler', function () {

    it('should create an instance of ConsultantHandler object', function (done) {
        expect(new ConsultantHandler()).to.be.instanceof(ConsultantHandler);
        done();
    });

    it('should add a Consultant', function (done) {
        var consultantHandler = new ConsultantHandler();

        consultantHandler.handlers.consultantCreateV1(new Consultant({}));

        expect(consultantHandler.consultants).to.have.length.above(0);
        done();
    });

    it('should update a Consultant', function (done) {
        var consultantHandler = new ConsultantHandler();

        var consultant = new Consultant(1, 'name', 123, 123, 'addres', 222, 345, 123, 6543, 'email');

        var uuid = consultantHandler.handlers.consultantCreateV1(consultant);

        consultant.name = 'update';

        consultantHandler.handlers.consultantUpdateV1(consultant);

        expect(consultantHandler.consultants[0].name).to.eql('update');
        done();
    });

    it('should fail to update a Consultant', function (done) {
        var consultantHandler = new ConsultantHandler();

        expect(function(){
            consultantHandler.handlers.consultantUpdateV1(new Consultant({}));
        }).to.throw(Error);
        done();
    });

    it('should nuke the Consultants', function (done) {
        var consultantHandler = new ConsultantHandler();

        consultantHandler.handlers.consultantCreateV1(new Consultant({}));

        consultantHandler.handlers.nukeConsultantsV1();

        expect(consultantHandler.consultants.length).to.eql(0);
        done();
    });
});