var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var Schedule = requireHelper('entities/Scheduling');
var SchedulingHandler = requireHelper('handlers/SchedulingHandler');

describe('Scheduling handler', function () {

    it('should create an instance of ScheduleHandler object', function (done) {
        expect(new SchedulingHandler()).to.be.instanceof(SchedulingHandler);
        done();
    });

    it('should add a Schedule', function (done) {
        var schedulingHandler = new SchedulingHandler();

        schedulingHandler.handlers.schedulingCreateV1(new Schedule({}));

        expect(schedulingHandler.schedulings).to.have.length.above(0);
        done();
    });

    xit('should update a Schedule', function (done) {
        var schedulingHandler = new SchedulingHandler();

        var schedule = new Schedule(1, new Date(), 2, new Date(), 4,[{id:1, dQty:0, sQty:0}]);

        schedulingHandler.handlers.schedulingCreateV1(schedule);



        schedulingHandler.handlers.schedulingUpdateV1({uuid:1, items:[{id:1, dQty:0, sQty:0}], updated:new Date(), date:date, status:4});

        expect(schedulingHandler.schedulings[0].status).to.eql(4);
        done();
    });
});