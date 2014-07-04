var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var Consultant = requireHelper('entities/Consultant');

describe('Consultant entity', function () {

    it('should create an Consultant object', function (done) {
        expect(new Consultant({})).to.be.instanceof(Consultant);
        done();
    });

    it('should fail to create an Consultant object', function (done) {
        expect(function () {
            new Consultant();
        }).to.throw(Error);
        done();
    });

});