var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var checkModule = requireHelper('check');

var Check = checkModule.Entity;
var CheckHandler = checkModule.Handler;

describe('Check handler', function () {

    it('should create an instance of CheckHandler object', function (done) {
        expect(new CheckHandler()).to.be.instanceof(CheckHandler);
        done();
    });

    it('should add a Check', function (done) {
        var checkHandler = new CheckHandler();

        checkHandler.handlers.checkAddV1(new Check({}));

        expect(checkHandler.checks).to.have.length.above(0);
        done();
    });

    it('should change sate in a Check', function (done) {
        var checkHandler = new CheckHandler();

        var check = new Check(1, 123, 123, 123, 123, new Date(), 222);

        var uuid = checkHandler.handlers.checkAddV1(check);

        checkHandler.handlers.checkChangeStateV1({uuid: 1, state: 2});

        expect(checkHandler.checks[0].state).to.eql(2);
        done();
    });
});