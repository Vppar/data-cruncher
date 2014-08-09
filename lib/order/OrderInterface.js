'use strict';

var ObjectUtils = require('../handlers/ObjectUtils.js');
var Order = require('./Order.js');
var MasterKeeper = require('../keepers/MasterKeeper.js');
var ArrayUtils = require('../handlers/ArrayUtils.js');
var q = require('q');

function OrderInterface(journalKeeper, orderHandler) {

  var currentEventVersion = 1;

  ObjectUtils.superInvoke(this, journalKeeper, 'Order', Order, currentEventVersion);

  this.add = function add(order) {

      var deferred = q.defer();

      if (!(order instanceof Order)) {
        return deferred.reject('Wrong instance to OrderKeeper');
      }
      var orderObj = new Order(order);

      return this.journalize('Add', orderObj);
    };

  /**
   * Update an order
   */
  this.update = function update(uuid, items) {
      var order = ArrayUtils.find(orderHandler.orders, 'uuid', uuid);
      if (!order) {
        throw Error('Unable to find an order with uuid=\'' + uuid + '\'');
      }
      var updateEv = {
        uuid: order.uuid,
        updated: new Date().getTime(),
        items: items
      };

      return this.journalize('Update', updateEv);
    };

  /**
   * Update the item qty of an order
   */
  this.updateItemQty = function (uuid, items) {
      var order = ArrayUtils.find(orderHandler.orders, 'uuid', uuid);
      if (!order) {
        throw Error('Unable to find an order with uuid=\'' + uuid + '\'');
      }
      var updateEv = {
        uuid: order.uuid,
        updated: new Date().getTime(),
        items: items
      };

      return this.journalize('UpdateItemQty', updateEv);
    };

  /**
   * Cancel an order
   */
  this.cancel = function(uuid) {
      var order = ArrayUtils.find(orderHandler.orders, 'uuid', uuid);
      if (!order) {
        throw Error('Unable to find an order with uuid=\'' + uuid + '\'');
      }
      var cancelEv = {
        uuid: order.uuid,
        canceled: new Date().getTime()
      };

      return this.journalize('Cancel', cancelEv);
    };

  this.read = function (uuid) {
    var order = ArrayUtils.find(orderHandler.orders, 'uuid', uuid);
    return order;
  };

  this.list = function () {
    var orders = [].concat(orderHandler.orders);
    return orders;
  };
}

ObjectUtils.inherit(OrderInterface, MasterKeeper);

module.exports = OrderInterface;