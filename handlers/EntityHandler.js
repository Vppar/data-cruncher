var _ = require('underscore');
var ObjectUtils = require('./ObjectUtils.js');
var ArrayUtils = require('./ArrayUtils.js');
var Entity = require('./../entities/Entity.js');

function EntityHandler() {

    var entities = [];
    this.entities = entities;
    this.handlers = {};

    function getNextId() {
        return ++currentCounter;
    }

// Nuke event for clearing the entities list
    ObjectUtils.ro(this.handlers, 'nukeEntitiesV1', function () {
        entities.length = 0;
        return true;
    });

    ObjectUtils.ro(this.handlers, 'entityCreateV1', function (event) {

        var eventData = IdentityService.getUUIDData(event.uuid);

        if (eventData.deviceId === IdentityService.getDeviceId()) {
            currentCounter =
                    currentCounter >= eventData.id ? currentCounter : eventData.id;
        }

        event = new Entity(event);
        entities.push(event);

        return event.uuid;
    });

    ObjectUtils.ro(this.handlers, 'entityUpdateV1', function (event) {
        var entry = ArrayUtils.find(entities, 'uuid', event.uuid);

        if (entry !== null) {

            event = angular.copy(event);
            delete event.uuid;
            angular.extend(entry, event);

        } else {
            throw 'User not found.';
        }

        return entry.uuid;
    });
}

module.exports = EntityHandler;