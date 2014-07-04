'use strict';

var _ = require('underscore');
var ObjectUtils = require('./ObjectUtils.js');
var ArrayUtils = require('./ArrayUtils.js');
var Coin = require('./../entities/Coin.js');

function CoinHandler(name) {

    // FIXME - Make it flexible
    var vault = [];

    this.vault = vault;
    this.handlers = {};

    /**
     * Registering handlers
     */
    ObjectUtils.ro(this.handlers, name + 'AddV1', function (event) {
        // Get the coin info from type map, get the respective entity
        // and instantiate

        event = new Coin(event);
        vault.push(event);

        return event.uuid;
    });

    ObjectUtils.ro(this.handlers, name + 'CancelV1', function (event) {

        var coin = ArrayUtils.find(vault, 'uuid', event.uuid);

        if (coin) {
            coin.canceled = event.canceled;
        } else {
            throw Error('Unable to find a ' + name + ' with uuid=\'' + event.uuid + '\'');
        }
    });
    ObjectUtils.ro(this.handlers, name + 'LiquidateV1', function (event) {
        var coin = ArrayUtils.find(vault, 'uuid', event.uuid);
        if (coin) {
            // Get the coin info from type map and get the respective
            // liquidate variable name
            coin.liquidated = event.liquidated;
        } else {
            throw Error('Unable to find a ' + name + ' with uuid=\'' + event.uuid + '\'');
        }

        return event.uuid;
    });

    ObjectUtils.ro(this.handlers, 'updateReceivableV1', function (event) {
        var entry = ArrayUtils.find(vault, 'uuid', event.uuid);

        if (entry !== null) {

            event = _.clone(event);
            //remove properties read only.
            delete event.uuid;
            delete event.created;
            delete event.entityId;
            _.extend(entry, event);

        } else {
            throw Error('Receivable not found.');
        }

        return entry.uuid;
    });

    ObjectUtils.ro(this.handlers, name + 'UpdatePaymentV1', function (event) {
        var coin = ArrayUtils.find(vault, 'uuid', event.uuid);

        if (coin) {
            coin.payment = event.payment;
        } else {
            throw Error('Unable to find a ' + name + ' with uuid=\'' + event.uuid + '\'');
        }

        return event.uuid;
    });

    // Nuke event for clearing the vault list
    ObjectUtils.ro(this.handlers, 'nukeCoinsV1', function () {
        vault.length = 0;
        return true;
    });
}

module.exports = CoinHandler;