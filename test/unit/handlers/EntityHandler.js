var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var Entity = requireHelper('entities/Entity');
var EntityHandler = requireHelper('handlers/EntityHandler');

describe('Entity handler', function () {

    it('should create an instance of EntityHandler object', function (done) {
        expect(new EntityHandler()).to.be.instanceof(EntityHandler);
        done();
    });

    it('should create an Entity', function (done) {
        var entityHandler = new EntityHandler();

        entityHandler.handlers.entityCreateV1(new Entity({}));

        expect(entityHandler.entities).to.have.length.above(0);
        done();
    });

    it('should update an entity', function (done) {
        var entityHandler = new EntityHandler();

        var entity = new Entity(1, 'name', 'emails', new Date(), 12123, 123123, 1231231, 123,  132123);

        var uuid = entityHandler.handlers.entityCreateV1(entity);

        entity.name = 'update';

        entityHandler.handlers.entityUpdateV1(entity);

        expect(entityHandler.entities[0].name).to.eql('update');
        done();
    });

    it('should fail to update an entity', function (done) {
        var entityHandler = new EntityHandler();

        expect(function(){
            entityHandler.handlers.entityUpdateV1(new Entity({}));
        }).to.throw(Error);
        done();
    });

    it('should nuke the entities', function (done) {
        var entityHandler = new EntityHandler();

        entityHandler.handlers.entityCreateV1(new Entity({}));
        entityHandler.handlers.entityCreateV1(new Entity({}));
        entityHandler.handlers.entityCreateV1(new Entity({}));

        entityHandler.handlers.nukeEntitiesV1(new Entity({}));

        expect(entityHandler.entities.length).to.eql(0);
        done();
    });
});