'use strict';

var _ = require('underscore');
var ArrayUtils = require('./ArrayUtils.js');
var Consultant = require('./../entities/Consultant.js');

function ConsultantHandler() {

    var consultants = [];
    this.consultants = consultants;
    this.handlers = {};

// Nuke event for clearing the consultants list
    this.handlers.nukeConsultantsV1 = function () {
        consultants.length = 0;
        return true;
    };

    this.handlers.consultantCreateV1 = function (event) {
        event = new Consultant(event);
        consultants.push(event);

        return event.uuid;
    };

    this.handlers.consultantUpdateV1 = function (event) {
        var entry = ArrayUtils.find(consultants, 'uuid', event.uuid);
        if (entry !== null) {

            event = _.clone(event);
            delete event.uuid;
            _.extend(entry, event);

        } else {
            throw Error('User not found.');
        }

        return entry.uuid;
    };
}

module.exports = ConsultantHandler;