'use strict';

var ArrayUtils = require('./../handlers/ArrayUtils.js');
var PurchaseOrder = require('./PurchaseOrder.js');
var TypeHandler = require('./../Type/TypeHandler.js');

function PurchaseOrderHandler() {

  this.purchases = [];
  var that = this;

  this.status = new TypeHandler().types.purchaseOrderStatus;


  // commented for now, because they aren't being used.
  this.STATUS_STASHED = ArrayUtils.find(this.status, 'name', 'stashed').id;
  this.STATUS_CANCELED = ArrayUtils.find(this.status, 'name', 'canceled').id;
  this.STATUS_CONFIRMED = ArrayUtils.find(this.status, 'name', 'confirmed').id;
  this.STATUS_PARC_REC = ArrayUtils.find(this.status, 'name', 'partiallyReceived').id;
  this.STATUS_RECEIVED = ArrayUtils.find(this.status, 'name', 'received').id;

  var _this = this;

  this.handlers = {};

// ############################################################################################################
// Handlers V1
// ############################################################################################################

// Nuke event for clearing the purchases list
  this.handlers.nukePurchasesV1 = function () {
    that.purchases.length = 0;
    return true;
  };

  this.handlers.purchaseOrderAddV1 = function (event) {
    // There wasn't update or status fields
    event.updated = event.created;
    event.status = _this.STATUS_CONFIRMED;

    return _this.handlers.purchaseOrderAddV2(event);
  };

  this.handlers.purchaseOrderRedeemV1 = function (event) {
    event.status = _this.STATUS_RECEIVED;
    event.updated = event.received;

    return _this.handlers.purchaseOrderReceiveV2(event);
  };

  this.handlers.purchaseOrderReceiveV1 = function (event) {
    event.status = _this.STATUS_PARC_REC;
    return _this.handlers.purchaseOrderReceiveProductV2(event);
  };

// ############################################################################################################
// Handlers V2
// ############################################################################################################

  this.handlers.purchaseOrderAddV2 = function (event) {
    event = new PurchaseOrder(event);
    that.purchases.push(event);

    return event.uuid;
  };

  this.handlers.purchaseOrderUpdateV2 = function (event) {
    var purchaseEntry = ArrayUtils.find(that.purchases, 'uuid', event.uuid);

    purchaseEntry.updated = event.updated;
    purchaseEntry.amount = event.amount;
    purchaseEntry.discount = event.discount;
    purchaseEntry.freight = event.freight;
    purchaseEntry.points = event.points;
    purchaseEntry.items = event.items;
    purchaseEntry.cost = event.cost;

    return event.uuid;
  };

  this.handlers.purchaseOrderChangeStatusV2 = function (event) {
    var purchaseEntry = ArrayUtils.find(that.purchases, 'uuid', event.uuid);

    var status = {
      uuid: event.uuid,
      from: purchaseEntry.status,
      to: event.status
    };

    purchaseEntry.status = event.status;
    purchaseEntry.updated = event.updated;

    return status;
  };

  this.handlers.purchaseOrderCancelV2 = function (event) {
    var purchaseEntry = ArrayUtils.find(that.purchases, 'uuid', event.uuid);

    purchaseEntry.updated = event.updated;
    purchaseEntry.canceled = event.canceled;
    purchaseEntry.status = event.status;

    return event.uuid;
  };

  this.handlers.purchaseOrderReceiveV2 = function (event) {
    var purchaseEntry = ArrayUtils.find(that.purchases, 'uuid', event.uuid);
    purchaseEntry.updated = event.updated;
    purchaseEntry.received = event.received;
    purchaseEntry.status = event.status;
    purchaseEntry.nfeNumber = event.nfeNumber;

    return event.uuid;
  };

  this.handlers.purchaseOrderReceiveProductV2 = function (event) {
    var purchaseEntry = ArrayUtils.find(that.purchases, 'uuid', event.uuid);

    var receive = {};

    receive.productId = event.productId;
    receive.nfeNumber = event.nfeNumber;
    receive.extNumber = event.extNumber;
    receive.received = event.received;
    receive.qty = event.qty;

    purchaseEntry.itemsReceived.push(receive);
    purchaseEntry.extNumber = event.extNumber;
    purchaseEntry.status = event.status;
    purchaseEntry.updated = event.updated;

    return receive.productId;
  };
}

module.exports = PurchaseOrderHandler;