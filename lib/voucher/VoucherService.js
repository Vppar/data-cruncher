'use strict';

var _ = require('underscore');
var Voucher = require('./Voucher.js');
var ArrayUtils = require('../handlers/ArrayUtils.js');
var q = require('q');

function VoucherService(voucherInterface) {

  var that = this;

  var isValid = function (voucher) {
    var invalidProperty = {};
    // FIXME - Verify if is a valid entityId
    invalidProperty.entityId = true;
    // FIXME - Verify if is a valid voucher type
    invalidProperty.type = !_.isUndefined(voucher.type);
    invalidProperty.amount = Number(voucher.amount) > 0;

    var result = [];

    for (var ix in invalidProperty) {
      if (!invalidProperty[ix]) {
        // Create a new empty object, set a property
        // with the name of the invalid property,
        // fill it with the invalid value and add to
        // the result
        var error = {};
        error[ix] = voucher[ix];
        result.push(error);
      }
    }

    return result;
  };


  this.create = function (voucher) {
    var result = null;
    var deferred = q.defer();
    var hasErrors = isValid(voucher);
    if (hasErrors.length === 0) {
      if (!(voucher instanceof Voucher)) {
        voucher = new Voucher(
          null,
          voucher.entity,
          voucher.type,
          voucher.amount
        );
      }

      result = voucherInterface.create(voucher);
      result['catch'](function (err) {
        console.log('VoucherService.create: -Failed to create a voucher. ', err);
      });
    } else {
      result = deferred.reject('VoucherService.create: -Invalid voucher. ', hasErrors);
    }
    return result;
  };


  this.redeem = function (type, id, document) {
    if (!type || !id) {
      console.log('No voucher/id passed to VoucherService.redeem()');
    }

    var vouchers = that.list(type);
    var voucher = ArrayUtils.find(vouchers, 'id', id);

    if (!voucher) {
      throw Error('VoucherService.redeem: voucher does not exist!');
    }

    if (voucher.redeemed) {
      throw Error('VoucherService.redeem: voucher already redeemed!');
    }

    if (voucher.canceled) {
      throw Error('VoucherService.canceled: voucher already canceled!');
    }

    return voucherInterface.redeem(type, id, document);
  };


  this.cancel = function (type, id) {
    if (!type || !id) {
      console.log('No voucher/id passed to VoucherService.cancel()');
    }

    var vouchers = that.list(type);
    var voucher = ArrayUtils.find(vouchers, 'id', id);

    if (!voucher) {
      throw Error('VoucherService.redeem: voucher does not exist!');
    }

    if (voucher.redeemed) {
      throw Error('VoucherService.redeem: voucher already redeemed!');
    }

    if (voucher.canceled) {
      throw Error('VoucherService.canceled: voucher already canceled!');
    }

    return voucherInterface.cancel(type, id);
  };

  this.list = function (type) {
    if (!type) {
      throw Error('VoucherService.list: invalid type');
    }

    return voucherInterface.list(type);
  };


  this.listByDocument = function (document) {
    if (!document) {
      throw Error('VoucherService.listByDocument: missing document');
    }

    return voucherInterface.listByDocument(document);
  };

  this.listByOrigin = function (document) {
    if (!document) {
      throw Error('VoucherService.listByDocument: missing document');
    }

    return voucherInterface.listByOrigin(document);
  };

  this.getVoucher = function (type, id) {
    var voucherId = _.isObject(type) ? type.id : id;
    var vouchers = this.list(type);
    return ArrayUtils.find(vouchers, 'id', voucherId);
  };


  this.bulkCreate = function (vouchers) {
    var creationPromises = [];
    var deferred = q.defer();

    // Vouchers can be either vouchers or giftCards
    for (var idx in vouchers) {
      creationPromises.push(that.create(vouchers[idx]));
    }

    return deferred.all(creationPromises);
  };


  this.bulkProcess = function (vouchers, entity, document) {
    var voucherPromises = [];

    var deferred = q.defer();

    for (var ix in vouchers) {
      var usedVoucher = vouchers[ix];
      if (usedVoucher.amount > 0) {
        var existingVoucher = this.getVoucher(usedVoucher.type, usedVoucher.couponId);

        if (!existingVoucher) {
          throw Error('VoucherService.bulkRegister: Voucher not found!');
        }

        if (existingVoucher.redeemed) {
          // FIXME: voucher was already redeemed! What should I do!?
          throw Error('VoucherService.bulkRegister: Voucher already used!');
        }

        if (usedVoucher.amount > existingVoucher.amount) {
          throw Error('VoucherService.bulkRegister: Invalid amount!');
        }

        voucherPromises.push(this.redeem(existingVoucher.type, existingVoucher.id, document));

        if (usedVoucher.amount < existingVoucher.amount) {

          // Customer did not use the whole voucher. Create a new one with
          // difference.
          var change = Math.round((existingVoucher.amount - usedVoucher.amount) * 100) / 100;

          var changeVoucher = new Voucher({
            id: null,
            amount: change,
            entity: usedVoucher.entity,
            type: usedVoucher.type,
            origin: document
          });

          voucherPromises.push(that.create(changeVoucher));
        }
      } else {
        console.log('Voucher will be ignored because its amount is 0: ' + JSON.stringify(usedVoucher));
      }
    }
    return deferred.resolve(voucherPromises);
  };
}

  module.exports = VoucherService;