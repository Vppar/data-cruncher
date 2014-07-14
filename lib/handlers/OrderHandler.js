'use strict';

var _ = require('underscore');
var ArrayUtils = require('./ArrayUtils.js');
var Order = require('./../entities/Order.js');

function OrderHandler() {

  this.handlers = {};
  this.orders = [];
  var that = this;

  /**
   * Registering handlers
   */
  this.handlers.orderAddV1 = function (event) {
    event = new Order(event);
    that.orders.push(event);

    return event.uuid;
  };

  this.handlers.orderCancelV1 = function (event) {
    var orderEntry = ArrayUtils.find(that.orders, 'uuid', event.uuid);
    if (orderEntry) {
      orderEntry.canceled = event.canceled;
    } else {
      throw Error('Unable to find an order with uuid=\'' + event.uuid + '\'');
    }
  };

  this.handlers.orderUpdateV1 = function (event) {
    var orderEntry = ArrayUtils.find(that.orders, 'uuid', event.uuid);
    if (orderEntry) {
      orderEntry.items = event.items;
      orderEntry.updated = event.updated;
    } else {
      throw Error('Unable to find an order with uuid=\'' + event.uuid + '\'');
    }
  };

  this.handlers.orderUpdateItemQtyV1 = function (event) {
    var orderEntry = ArrayUtils.find(that.orders, 'uuid', event.uuid);

    function orderFilter(item) {
      var result = false;
      if (!item.type && item.id === event.items[ix].id) {
        result = true;
      }
      return result;
    }

    if (orderEntry) {

      for (var ix in event.items) {
        // var item = ArrayUtils.find(orderEntry.items, 'id',
        // event.items[ix].id);
        // FIXME this workround exists because couse
        // payment-discount.js set an id property to voucher
        // and gifts cards.
        var item = _.find(orderEntry.items, orderFilter);

        if (!item.dQty) {
          item.dQty = 0;
        }
        item.dQty += event.items[ix].dQty;
      }
    } else {
      throw Error('Unable to find an order with uuid=\'' + event.uuid + '\'');
    }
  };

  // Nuke event for clearing the orders list
  this.handlers.nukeOrdersV1 = function () {
    that.orders.length = 0;
    return true;
  };
}

module.exports = OrderHandler;