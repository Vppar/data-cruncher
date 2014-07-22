'use strict';

var _ = require('underscore');
var ObjectUtils = require('../handlers/ObjectUtils.js');
var ArrayUtils = require('../handlers/ArrayUtils.js');
var Voucher = require('./Voucher.js');
var MasterKeeper = require('../keepers/MasterKeeper.js');

function VoucherInterface(journalKeeper, voucherHandler) {

  var currentEventVersion = 1;

  ObjectUtils.superInvoke(this, journalKeeper, 'Voucher', Voucher, currentEventVersion);

  this.create =
    function (newVoucher) {
      if (!(newVoucher instanceof Voucher)) {
        throw Error('Wrong instance to VoucherKeeper');
      }

      var voucherObj = _.clone(newVoucher);
      voucherObj.created = new Date().getTime();

      var event = new Voucher(voucherObj);

      return this.journalize(event);
    };

  /**
   * cancel(type, id)
   */
  this.cancel =
    function (type, id) {
      var vouch = ArrayUtils.find(voucherHandler.voucher[type], 'id', id);

      if (!vouch) {
        throw Error('Unable to find a voucher with id=\'' + id + '\'');
      }

      var event = new Voucher(id, null, type, null);
      event.canceled = (new Date()).getTime();

      return this.journalize(event);
    };

  /**
   * redeem (type, id)
   */
  this.redeem =
    function (type, id, document) {
      var vouch = ArrayUtils.find(voucherHandler.voucher[type], 'id', id);

      if (!vouch) {
        throw Error('Unable to find a voucher with id=\'' + id + '\'');
      }

      var event = new Voucher(id, null, type, null);
      event.redeemed = (new Date()).getTime();
      event.documentId = document;

      // save the journal entry
      return this.journalize(event);
    };
}

ObjectUtils.inherit(VoucherInterface, MasterKeeper);

module.exports = VoucherInterface;