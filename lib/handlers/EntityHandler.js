'use strict';

var _ = require('underscore');
var ArrayUtils = require('./ArrayUtils.js');
var Entity = require('./../entities/Entity.js');

function EntityHandler() {

    var entities = [];
    this.entities = entities;
    this.handlers = {};

// Nuke event for clearing the entities list
    this.handlers.nukeEntitiesV1 = function () {
        entities.length = 0;
        return true;
    };

    this.handlers.entityCreateV1 = function (event) {
        event = new Entity(event);
        entities.push(event);

        return event.uuid;
    };

    this.handlers.entityUpdateV1 = function (event) {
        var entry = ArrayUtils.find(entities, 'uuid', event.uuid);

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

module.exports = EntityHandler;