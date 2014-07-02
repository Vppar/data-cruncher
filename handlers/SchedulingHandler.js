var _ = require('underscore');
var ObjectUtils = require('./ObjectUtils.js');
var ArrayUtils = require('./ArrayUtils.js');
var Schedule = require('./../entities/Scheduling.js');

function SchedulingHandler() {

    var schedulings = [];
    this.schedulings = schedulings;
    this.handlers = {};

    function getNextId() {
        return ++currentCounter;
    }

    /**
     * Registering handlers
     */
    ObjectUtils.ro(this.handlers, 'schedulingCreateV1', function (event) {
        var eventData = IdentityService.getUUIDData(event.uuid);

        if (eventData.deviceId === IdentityService.getDeviceId()) {
            currentCounter =
                    currentCounter >= eventData.id ? currentCounter : eventData.id;
        }

        event = new Schedule(event);
        schedulings.push(event);

        return event.uuid;
    });

    ObjectUtils.ro(this.handlers, 'schedulingUpdateV1', function (event) {
        var scheduleEntry = ArrayUtils.find(schedulings, 'uuid', event.uuid);

        var finalItems = scheduleEntry.items;

        for (var ix in event.items) {
            var item = event.items[ix];
            var scheduled = ArrayUtils.find(finalItems, 'id', item.id);

            if (scheduled) {
                scheduled.dQty += item.dQty;
                scheduled.sQty = item.sQty;

                if (!item.deliveredDate) {
                    item.deliveredDate = scheduled.deliveredDate;
                }

                scheduled.deliveredDate = item.deliveredDate;
            } else {
                finalItems.push(item);
            }

        }

        if (scheduleEntry) {
            scheduleEntry.updated = event.updated;
            scheduleEntry.date = event.date;
            scheduleEntry.items = finalItems;
            scheduleEntry.status = event.status;
        } else {
            throw 'Unable to find an scheduling with uuid=\'' + event.uuid + '\'';
        }
    });

    ObjectUtils.ro(this.handlers, 'schedulingRemoveV1', function (event) {
        var scheduleEntry = ArrayUtils.find(schedulings, 'uuid', event.uuid);
        if (scheduleEntry) {
            scheduleEntry.updated = event.updated;
            scheduleEntry.date = event.date;
            scheduleEntry.items = event.items;
        } else {
            throw 'Unable to find an scheduling with uuid=\'' + event.uuid + '\'';
        }
    });

// Nuke event for clearing the orders list
    ObjectUtils.ro(this.handlers, 'nukeSchedulingV1', function () {
        schedulings.length = 0;
        return true;
    });
}

module.exports = SchedulingHandler;