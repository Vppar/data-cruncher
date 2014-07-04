'use strict';

var ObjectUtils = require('./ObjectUtils.js');
var ArrayUtils = require('./ArrayUtils.js');
var Voucher = require('./../entities/Voucher.js');

function VoucherHandler() {


    var voucher = {
        voucher: [],
        coupon: [],
        giftCard: []
    };

    this.voucher = voucher;
    this.handlers = {};

// Nuke event for clearing the vouchers lists
    ObjectUtils.ro(this.handlers, 'nukeVouchersV1', function () {
        voucher.voucher.length = 0;
        voucher.coupon.length = 0;
        voucher.giftCard.length = 0;
        return true;
    });

    /**
     * EventHandler of Create.
     */
    ObjectUtils.ro(this.handlers, 'voucherCreateV1', function (event) {
        event = new Voucher(event);
        voucher[event.type].push(event);

        return event;
    });

    /**
     * EventHandler of cancel.
     */
    ObjectUtils.ro(this.handlers, 'voucherCancelV1', function (event) {

        var entry = ArrayUtils.find(voucher[event.type], 'id', event.id);
        if (entry === null) {
            throw 'Entity not found, cosistency must be broken! Replay?';
        } else {
            entry.canceled = event.canceled;
        }

        return event.id;
    });

    /**
     * EventHandler of redeem.
     */
    ObjectUtils.ro(this.handlers, 'voucherRedeemV1', function (event) {

        var entry = ArrayUtils.find(voucher[event.type], 'id', event.id);

        if (entry === null) {
            throw 'Entity not found, cosistency must be broken! Replay?';
        } else {
            entry.redeemed = event.redeemed;
            entry.documentId = event.documentId;
        }

        return event.id;
    });
}

module.exports = VoucherHandler;