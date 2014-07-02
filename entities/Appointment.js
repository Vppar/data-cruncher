var _ = require('underscore');
var ObjectUtils = require('./../handlers/ObjectUtils.js');

function Appointment(uuid, title, description, startDate, endDate, address, contacts,
              allDay, color, type, status) {
    var validProperties =
        [
            'uuid',
            'title',
            'description',
            'startDate',
            'endDate',
            'address',
            'contacts',
            'type',
            'status',
            'allDay',
            'color',
            'created'
        ];

    ObjectUtils.method(Appointment, 'isValid', function () {
        for ( var ix in this) {
            var prop = this[ix];

            if (!_.isFunction(prop)) {
                if (validProperties.indexOf(ix) === -1) {
                    throw 'Unexpected property ' + ix;
                }
            }
        }
    });

    if (arguments.length !== Appointment.length) {
        if (arguments.length === 1 && _.isObject(arguments[0])) {
            Appointment.prototype.isValid.apply(arguments[0]);
            ObjectUtils.dataCopy(this, arguments[0]);
        } else {
            throw 'Entity must be initialized with id, title, description, startDate, endDate, address, contacts,  type, status';
        }
    } else {
        this.uuid = uuid;
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.address = address;
        this.contacts = contacts;
        this.type = type;
        this.color = color;
        this.allDay = allDay;
        this.status = status;
    }

    ObjectUtils.ro(this, 'uuid', this.uuid);
}

module.exports = Appointment;