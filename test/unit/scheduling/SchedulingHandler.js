var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var scheduleModule = requireHelper('scheduling');

var Schedule = scheduleModule.Entity;
var SchedulingHandler = scheduleModule.Handler;

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

    it('should update a Schedule with items', function (done) {
        var schedulingHandler = new SchedulingHandler();

        var schedule = new Schedule(1, new Date(), 2, new Date(), 4,[{id:1, dQty:0, sQty:0}]);

        schedulingHandler.handlers.schedulingCreateV1(schedule);

        schedulingHandler.handlers.schedulingUpdateV1({uuid:1, items:[{id:1, dQty:0, sQty:0}], updated:new Date(), date: new Date(), status:4});

        expect(schedulingHandler.schedulings[0].status).to.eql(4);
        done();
    });

    it('should update a Schedule without items', function (done) {
        var schedulingHandler = new SchedulingHandler();

        var schedule = new Schedule(1, new Date(), 2, new Date(), 4,[]);

        schedulingHandler.handlers.schedulingCreateV1(schedule);

        schedulingHandler.handlers.schedulingUpdateV1({uuid:1, items:[{id:1, dQty:0, sQty:0}], updated:new Date(), date: new Date(), status:4});

        expect(schedulingHandler.schedulings[0].status).to.eql(4);
        done();
    });

    it('should fail to update a Schedule', function (done) {
        var schedulingHandler = new SchedulingHandler();

        expect(function(){
            schedulingHandler.handlers.schedulingUpdateV1({uuid:1});
        }).to.throw(Error);
        done();
    });

    it('should remove a Schedule', function (done) {
        var schedulingHandler = new SchedulingHandler();

        var schedule = new Schedule(1, new Date(), 2, new Date(), 4,[]);

        schedulingHandler.handlers.schedulingCreateV1(schedule);

        schedulingHandler.handlers.schedulingRemoveV1({uuid:1, items:[], updated:new Date(), date: new Date()});

        expect(schedulingHandler.schedulings[0].status).to.eql(4);
        done();
    });

    it('should fail to remove a Schedule', function (done) {
        var schedulingHandler = new SchedulingHandler();

        expect(function(){
            schedulingHandler.handlers.schedulingRemoveV1({uuid:1});
        }).to.throw(Error);
        done();
    });

    it('should nuke all Schedules', function (done) {
        var schedulingHandler = new SchedulingHandler();

        schedulingHandler.handlers.schedulingCreateV1(new Schedule({}));
        schedulingHandler.handlers.schedulingCreateV1(new Schedule({}));
        schedulingHandler.handlers.schedulingCreateV1(new Schedule({}));

        schedulingHandler.handlers.nukeSchedulingV1();

        expect(schedulingHandler.schedulings.length).to.eql(0);
        done();
    });
});