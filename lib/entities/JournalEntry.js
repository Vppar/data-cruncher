'use strict';

var _ = require('underscore');
var ObjectUtils = require('../handlers/ObjectUtils.js');

function JournalEntry(sequence, stamp, type, version, event) {

    var validProperties =
        [
            'sequence',
            'stamp',
            'type',
            'version',
            'event',
            'synced',
            'uuid'
        ];

    ObjectUtils.method(JournalEntry, 'isValid', function () {
        for (var ix in this) {
            var prop = this[ix];

            if (!_.isFunction(prop)) {
                if (validProperties.indexOf(ix) === -1) {
                    throw Error('Unexpected property ' + ix);
                }
            }
        }
    });

    if (arguments.length !== JournalEntry.length) {
        if (arguments.length === 1 && _.isObject(arguments[0])) {
            JournalEntry.prototype.isValid.apply(arguments[0]);
            ObjectUtils.dataCopy(this, arguments[0]);
        } else {
            throw Error('JournalEntry must be initialized with sequence, stamp, type, version and event');
        }
    } else {
        this.sequence = sequence;
        this.stamp = stamp;
        this.type = type;
        this.version = version;
        this.event = event;
        this.synced = 0;
        this.uuid = null;
    }
}

module.exports = JournalEntry;