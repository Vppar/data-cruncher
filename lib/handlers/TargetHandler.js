'use strict';

var ObjectUtils = require('./ObjectUtils.js');
var Target = require('./../entities/Target.js');
var ArrayUtils = require('./ArrayUtils.js');

function TargetHandler() {
    var targets = [];
    this.handlers = {};
    this.targets = targets;

    /**
     * Create the final target object and push it to the DataBase
     *
     * @param {event} - Object containing the nescessary data to create the target.
     */
    ObjectUtils.ro(this.handlers, 'targetAddV1', function (event) {
        event = new Target(event);
        targets.push(event);

        return event.uuid;
    });

    /**
     * Updates target object.
     *
     * @param {event} - Object to be updated.
     */
    ObjectUtils.ro(this.handlers, 'targetUpdateV1', function (event) {
        var oldTarget = ArrayUtils.find(targets, 'uuid', event.uuid);

        targets[targets.indexOf(oldTarget)] = event;

        return event.uuid;
    });
}

module.exports = TargetHandler;