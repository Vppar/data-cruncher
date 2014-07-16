var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var typeModule = requireHelper('type');

var Type = typeModule.Entity;
var TypeHandler = typeModule.Handler;

describe('Type handler', function () {

    it('should create an instance of TypeHandler object', function (done) {
        expect(new TypeHandler()).to.be.instanceof(TypeHandler);
        done();
    });

    it('should add a new Type', function (done) {
        var typeHandler = new TypeHandler();

        typeHandler.handlers.typeAddV1(new Type({classification:'teste', name:'Testename', id: 1}));

        expect(typeHandler.types.teste.length).to.eql(1);
        done();
    });

    it('should fail to add a repeated Type', function (done) {
        var typeHandler = new TypeHandler();

        var type = new Type({classification:'document', name:'Pedido', id: 1});

        expect(function(){
            typeHandler.handlers.typeAddV1(type);
        }).to.throw(Error);
        done();
    });
});