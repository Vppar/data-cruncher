var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var Entity = requireHelper('entities/Entity');

describe('Entity entity', function () {

    it('should create an Entity object', function (done) {
        expect(new Entity({})).to.be.instanceof(Entity);
        done();
    });

    it('should create an Entity object', function (done) {
        expect(new Entity(1, '', '', new Date(), 2, 2, 2, 2,
            2)).to.be.instanceof(Entity);
        done();
    });

    it('should fail to create an Entity object', function (done) {
        expect(function () {
            new Entity({uuid: 1, name: '', emails: '', birthDate: new Date(), phones: 2, cep: 2, document: 2, addresses: 2,
                invalid: 2});
        }).to.throw(Error);
        done();
    });

    it('should fail to create an Entity object', function (done) {
        expect(function () {
            new Entity();
        }).to.throw(Error);
        done();
    });
});