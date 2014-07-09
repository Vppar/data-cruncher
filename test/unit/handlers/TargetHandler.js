var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var Target = requireHelper('entities/Target');
var TargetHandler = requireHelper('handlers/TargetHandler');

describe('Subscription handler', function () {

    it('should create an instance of TargetHandler object', function (done) {
        expect(new TargetHandler()).to.be.instanceof(TargetHandler);
        done();
    });

    it('should add a new Target', function (done) {
        var targetHandler = new TargetHandler();

        targetHandler.handlers.targetAddV1(new Target({}));

        expect(targetHandler.targets).to.have.length.above(0);
        done();
    });

    it('should update a Target', function (done) {
        var targetHandler = new TargetHandler();

        targetHandler.handlers.targetAddV1(new Target(1, [], 2, 20, 'target'));

        targetHandler.handlers.targetUpdateV1({uuid:1, targets:[], type:2, totalAmount:20, name:'targetUpdated'});

        expect(targetHandler.targets[0].name).to.eql('targetUpdated');
        done();
    });
});