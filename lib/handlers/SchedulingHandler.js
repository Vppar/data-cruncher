'use strict';

var ArrayUtils = require('./ArrayUtils.js');
var Schedule = require('./../entities/Scheduling.js');

function SchedulingHandler() {

    var schedulings = [];
    this.schedulings = schedulings;
    this.handlers = {};

    /**
     * Registering handlers
     */
    this.handlers.schedulingCreateV1 = function (event) {
        event = new Schedule(event);
        schedulings.push(event);

        return event.uuid;
    };

    this.handlers.schedulingUpdateV1 = function (event) {
        var scheduleEntry = ArrayUtils.find(schedulings, 'uuid', event.uuid);

        if (scheduleEntry !== null && scheduleEntry) {
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

            scheduleEntry.updated = event.updated;
            scheduleEntry.date = event.date;
            scheduleEntry.items = finalItems;
            scheduleEntry.status = event.status;
        }else{
            throw Error('Unable to find an scheduling with uuid=\'' + event.uuid + '\'');
        }
    };

    this.handlers.schedulingRemoveV1 = function (event) {
        var scheduleEntry = ArrayUtils.find(schedulings, 'uuid', event.uuid);
        if (scheduleEntry!==null) {
            scheduleEntry.updated = event.updated;
            scheduleEntry.date = event.date;
            scheduleEntry.items = event.items;
        } else {
            throw Error('Unable to find an scheduling with uuid=\'' + event.uuid + '\'');
        }
    };

// Nuke event for clearing the orders list
    this.handlers.nukeSchedulingV1 = function () {
        schedulings.length = 0;
        return true;
    };
}

module.exports = SchedulingHandler;