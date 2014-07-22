'use strict';

var _ = require('underscore');
var ObjectUtils = require('../handlers/ObjectUtils.js');
var PurchaseOrder = require('./PurchaseOrder.js');
var MasterKeeper = require('../keepers/MasterKeeper.js');
var ArrayUtils = require('../handlers/ArrayUtils.js');
var q = require('q');

function PurchaseOrderInterface(journalKeeper, purchaseOrderHandler) {

  var currentEventVersion = 1;

  ObjectUtils.superInvoke(this, journalKeeper, 'PurchaseOrder', PurchaseOrder, currentEventVersion);

  /**
   * Adds an purchase order.
   *
   * @param {PurchaseOrder} purchaseOrder - Purchase order to
   *            be updated.
   * @return {object} result - Promise that will resolve when
   *         the add is done.
   */
  this.add = function(purchase) {

    var deferred = q.defer();

    if (!(purchase instanceof PurchaseOrder)) {
      return deferred.reject('Wrong instance to PurchaseOrderKeeper');
    }
    var purchaseObj = _.clone(purchase);

    var now = new Date().getTime();

    purchaseObj.created = now;
    purchaseObj.updated = now;
    purchaseObj.status = STATUS_STASHED;

    var event = new PurchaseOrder(purchaseObj);

    return this.journalize('Add', event);
  };

  /**
   * List purchase orders by status.
   *
   * @param {string} statusName - Status name.
   * @return {array} purchaseOrders - A list of purchase
   *         orders filtered by status.
   */
  this.listByStatus = function(statusName) {
    var selectedStatus = ArrayUtils.find(purchaseOrderHandler.status, 'name', statusName);

    if (!selectedStatus) {
      throw Error('PurchaseOrderKeeper.listByStatus: Invalid purchase order status: ' + statusName);
    }

    var purchaseOrders = ArrayUtils.list(purchaseOrderHandler.purchases, 'status', selectedStatus['id']);

    return _.clone(purchaseOrders);
  };

  /**
   * Update a purchase order.
   *
   * <pre>
   * Will only update the following fields:
   *  - uuid
   *  - updated
   *  - amount
   *  - discount
   *  - freight
   *  - points
   *  - items
   * </pre>
   *
   * @param {PurchaseOrder} purchaseOrder - Purchase order to
   *            be updated.
   * @return {object} result - Promise that will resolve when
   *         the update is done.
   */
  this.update = function update(purchaseOrder) {
    var recoveredPurchaseOrder = ArrayUtils.find(purchaseOrderHandler.purchases, 'uuid', purchaseOrder.uuid);

    if (!recoveredPurchaseOrder) {
      throw Error('Unable to find an PurchaseOrder with uuid=\'' + uuid + '\'');
    }

    var updateEv = {
      uuid: purchaseOrder.uuid,
      updated: new Date().getTime(),
      amount: purchaseOrder.amount,
      discount: purchaseOrder.discount,
      freight: purchaseOrder.freight,
      points: purchaseOrder.points,
      items: purchaseOrder.items,
      cost: purchaseOrder.cost
    };

    // save the journal entry
    return this.jornalize(updateEv);
  };

  /**
   * Change the status of a purchase order.
   *
   * @param {string} uuid - Purchase order to be updated.
   * @param {string} statusName - Purchase order to be
   *            updated.
   * @return {object} result - Promise that will resolve when
   *         the update is done.
   */
  this.changeStatus = function changeStatus(uuid, statusName) {
    var recoveredPurchaseOrder = ArrayUtils.find(purchases, 'uuid', uuid);

    if (!recoveredPurchaseOrder) {
      throw Error('Unable to find an PurchaseOrder with uuid=\'' + uuid + '\'');
    }

    var updateEv = {
      uuid: uuid,
      status: ArrayUtils.find(status, 'name', statusName)['id'],
      updated: new Date().getTime()
    };

    return this.journalize(updateEv);
  };

  /**
   * Redeem an order
   */
  this.receive = function (uuid, nfeNumber) {
    var purchase = ArrayUtils.find(purchaseOrderHandler.purchases, 'uuid', uuid);
    if (!purchase) {
      throw Error('Unable to find an PurchaseOrder with uuid=\'' + uuid + '\'');
    }

    var now = new Date().getTime();

    var redeemEv = {
      uuid: purchase.uuid,
      updated: now,
      status: purchaseOrderHandler.STATUS_RECEIVED,
      received: now,
      nfeNumber: nfeNumber
    };

    // save the journal entry
    return this.journalize('Receive', redeemEv);
  };

  /**
   * Cancel an order
   */
  this.cancel = function cancel(uuid) {
    var purchase = ArrayUtils.find(purchaseOrderHandler.purchases, 'uuid', uuid);
    if (!purchase) {
      throw Error('Unable to find an PurchaseOrder with uuid=\'' + uuid + '\'');
    }

    var now = new Date().getTime();

    var cancelEv = {
      uuid: purchase.uuid,
      status: STATUS_CANCELED,
      updated: now,
      canceled: new Date().getTime()
    };

    return this.journalize('Cancel', cancelEv);
  };

  /**
   * Mark as received an item of the order
   */
  this.receiveProduct = function(uuid, productId, nfeNumber, extNumber, qty) {
      var purchase = ArrayUtils.find(purchaseOrderHandler.purchases, 'uuid', uuid);
      if (!purchase) {
        throw Error('Unable to find an PurchaseOrder with uuid=\'' + uuid + '\'');
      }

      var item = ArrayUtils.find(purchase.items, 'id', productId);
      if (!item) {
        throw 'Unable to find in PurchaseOrder uuid=\'' + uuid + '\'' + ' an item with id=\'' + id + '\'';
      }

      var now = new Date().getTime();

      var receiveEv = {
        uuid: purchase.uuid,
        productId: productId,
        status: STATUS_PARC_REC,
        updated: now,
        nfeNumber: nfeNumber,
        extNumber: extNumber,
        received: now,
        qty: qty
      };

      // create a new journal entry
      var entry =
        new JournalEntry(
          null, receiveEv.received, 'purchaseOrderReceiveProduct', currentEventVersion, receiveEv);

      // save the journal entry
      return this.journalize(entry);
    };
}

ObjectUtils.inherit(PurchaseOrderInterface, MasterKeeper);

module.exports = PurchaseOrderInterface;