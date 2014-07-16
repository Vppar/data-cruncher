'use strict';

var _ = require('underscore');
var ArrayUtils = require('./../handlers/ArrayUtils.js');
var Coin = require('./Coin.js');

function CoinHandler(name) {

  // FIXME - Make it flexible

  this.vault = [];
  this.handlers = {};
  var that = this;

  /**
   * Registering handlers
   */
  this.handlers[name + 'AddV1'] = function (event) {
    // Get the coin info from type map, get the respective entity
    // and instantiate

    event = new Coin(event);
    that.vault.push(event);

    return event.uuid;
  };

  this.handlers[name + 'CancelV1'] = function (event) {

    var coin = ArrayUtils.find(that.vault, 'uuid', event.uuid);

    if (coin) {
      coin.canceled = event.canceled;
    } else {
      throw Error('Unable to find a ' + name + ' with uuid=\'' + event.uuid + '\'');
    }
  };
  this.handlers[name + 'LiquidateV1'] = function (event) {
    var coin = ArrayUtils.find(that.vault, 'uuid', event.uuid);
    if (coin) {
      // Get the coin info from type map and get the respective
      // liquidate variable name
      coin.liquidated = event.liquidated;
    } else {
      throw Error('Unable to find a ' + name + ' with uuid=\'' + event.uuid + '\'');
    }

    return event.uuid;
  };

  this.handlers.updateReceivableV1 = function (event) {
    var entry = ArrayUtils.find(that.vault, 'uuid', event.uuid);

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
  };

  this.handlers[name + 'UpdatePaymentV1'] = function (event) {
    var coin = ArrayUtils.find(that.vault, 'uuid', event.uuid);

    if (coin) {
      coin.payment = event.payment;
    } else {
      throw Error('Unable to find a ' + name + ' with uuid=\'' + event.uuid + '\'');
    }

    return event.uuid;
  };

  // Nuke event for clearing the vault list
  this.handlers.nukeCoinsV1 = function () {
    that.vault.length = 0;
    return true;
  };
}

module.exports = CoinHandler;