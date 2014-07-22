'use strict';

var _ = require('underscore');
var ObjectUtils = require('../handlers/ObjectUtils.js');
var Coin = require('./Coin.js');
var MasterKeeper = require('../keepers/MasterKeeper.js');
var ArrayUtils = require('../handlers/ArrayUtils.js');

function CoinInterface(journalKeeper, coinHandler) {

  var currentEventVersion = 1;

  ObjectUtils.superInvoke(this, journalKeeper, 'Coin', Coin, currentEventVersion);

  /**
   * Adds a coin to the list
   *
   * @param coin - Receivable to be added.
   */
  this.add = function (coin) {
    var coinObj = _.copy(coin);

    coinObj.created = (new Date()).getTime();

    var event = new Coin(coinObj);

    // save the journal entry
    return this.journalize('Add', event);
  };

  /**
   * Liquidate a coin.
   *
   * @param uuid - Identifier to the coin.
   * @param executionDate - Date that the coin was executed(payed or
   *            received).
   */
  this.liquidate = function (uuid, executionDate) {
    var coin = ArrayUtils.find(coinHandler.vault, 'uuid', uuid);
    if (!coin) {
      throw Error('Unable to find a ' + name + ' with uuid=\'' + uuid + '\'');
    }
    var liqEv = {
      uuid: uuid
    };
    liqEv.liquidated = executionDate;

    // save the journal entry
    return this.journalize(name + 'Liquidate', liqEv);
  };

  /**
   * Cancels a coin.
   *
   * @param uuid - uuid of the coin to be canceled.
   */
  this.cancel = function (uuid) {

    var coin = ArrayUtils.find(coinHandler.vault, 'uuid', uuid);
    if (!coin) {
      throw Error('Unable to find a ' + name + ' with uuid=\'' + uuid + '\'');
    }
    var time = (new Date()).getTime();
    var cancelEv = {
      uuid: uuid,
      canceled: time
    };

    // save the journal entry
    return this.journalize(name + 'Cancel', cancelEv);
  };

  /**
   * Change the state of a receivable.
   *
   * @param {check} - check with the updated state.
   */
//  this.update = function (coin) {
//    var receivable = _.clone(ArrayUtils.find(coinHandler.vault, 'uuid', coin.uuid));
//
//    var check = new CheckPayment(check);
//    delete check.uuid;
//    receivable.payment = check;
//
//    // create a new journal entry
//    var entry = new JournalEntry(null, receivable.created, name + 'UpdatePayment', currentEventVersion, receivable);
//    // save the journal entry
//    return JournalKeeper.compose(entry);
//
//  };

  this.updateReceivable = function (receivable) {
    var event = _.clone(receivable);

    return this.journalize('updateReceivable', event);
  };

  /**
   * Change the state of a receivable.
   *
   * @param {check} - check with the updated state.
   */
  this.updateCheck = function (check) {
    var receivable = _.clone(ArrayUtils.find(coinHandler.vault, 'uuid', check.uuid));

    //FIXME - quick fix to remove the old and useless check.id
    if (check.id || check.id === null) {
      delete check.id;
    }
    //FIXME - check shouldn't have created field,
    //it was already removed from the warmUp service,
    //but i'll keep this since the first version of the warmUp that
    //went to production had the field.
    if (check.created || check.created === null) {
      delete check.created;
    }

    check = new CheckPayment(check);
    delete check.uuid;
    receivable.payment = check;

    return this.journalize(name + 'UpdatePayment', receivable);
  };
}

ObjectUtils.inherit(CoinInterface, MasterKeeper);

module.exports = CoinInterface;