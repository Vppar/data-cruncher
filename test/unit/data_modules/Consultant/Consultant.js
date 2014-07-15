var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../../require-helper');

var consultantModule = requireHelper('data_modules/Consultant');

var Consultant = consultantModule.Entity;

describe('Consultant entity', function () {

    it('should create an Consultant object', function (done) {
        expect(new Consultant({})).to.be.instanceof(Consultant);
        done();
    });

    it('should create an Consultant object', function (done) {
        expect(new Consultant(1, '', 2, 2, 1, 2, 2, 3, 4, 1)).to.be.instanceof(Consultant);
        done();
    });

    it('should fail to create an Consultant object with an invalid property', function (done) {
        expect(function () {
            new Consultant({uuid: 1, name: '', mkCode: 2, cep: 2, address: 1, cpf: 2, bank: 2, agency: 3, account: 4,
                invalid: 1});
        }).to.throw(Error);
        done();
    });

    it('should fail to create an Consultant object', function (done) {
        expect(function () {
            new Consultant();
        }).to.throw(Error);
        done();
    });

});