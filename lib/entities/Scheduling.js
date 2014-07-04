'use strict';

var _ = require('underscore');
var ObjectUtils = require('../handlers/ObjectUtils.js');

function Schedule(uuid, created, documentUUID, date, status, items) {

    var validProperties = [
        'uuid', 'created', 'documentUUID', 'date', 'status', 'items', 'updated'
    ];

    ObjectUtils.method(Schedule, 'isValid', function () {
        for ( var ix in this) {
            var prop = this[ix];
            if (!_.isFunction(prop)) {
                if (validProperties.indexOf(ix) === -1) {
                    throw Error('Unexpected property ' + ix);
                }
            }
        }
    });

    if (arguments.length !== Schedule.length) {
        if (arguments.length === 1 && _.isObject(arguments[0])) {
            Schedule.prototype.isValid.apply(arguments[0]);
            ObjectUtils.dataCopy(this, arguments[0]);
        } else {
            throw Error('Schedule must be initialized with uuid, documentUUID, date, items');
        }
    } else {
        this.uuid = uuid;
        this.date = date;
        this.items = items;
        this.created = created;
        this.documentUUID = documentUUID;
        this.status = status;
    }
    ObjectUtils.ro(this, 'uuid', this.uuid);
    ObjectUtils.ro(this, 'created', this.created);
    ObjectUtils.ro(this, 'documentUUID', this.documentUUID);
}

module.exports = Schedule;