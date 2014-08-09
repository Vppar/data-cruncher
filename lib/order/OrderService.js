'use strict';

var _ = require('underscore');
var Order = require('./Order.js');
var q = require('q');

function OrderService(orderInterface) {

  var orderTemplate = {
    // FIXME: generate codes dynamically.
    // Should codes be generated here or in OrderKeeper?
    code: 'mk-0001-14',
    date: null,
    canceled: false,
    customerId: null,
    items: null
  };

  var order = {};

  /**
   * Verifies if a order is valid.
   *
   * @param order - Order object to be validated
   * @return {Array} Array of objects containing the invalid
   *         properties
   */
  this.isValid = function(order) {
    var invalidProperty, result = [], now = new Date();

    // See validation helpers in the end of this file
    invalidProperty = {
      // FIXME: implement order code validation once the
      // generator
      // is implemented.
      // code : isValidOrderCode(order.code),
      date: _.isDate(order.date) && order.date <= now,
      canceled: isBoolean(order.canceled),
      customerId: isValidCustomerId(order.customerId),
      items: areValidItems(order.items)
    };

    for (var ix in invalidProperty) {
      if (invalidProperty.hasOwnProperty(ix)) {
        if (!invalidProperty[ix]) {
          // Create an empty object, set a property
          // with
          // the name of
          // the invalid property, fill it with the
          // invalid value and
          // add the result.
          var error = {};
          error[ix] = order[ix];
          result.push(error);
        }
      }
    }

    return result;
  };

  /**
   * Register an order in the datastore.
   *
   * @param order - Order object to be registered.
   * @return Array - Array of objects containing the invalid
   *         properties.
   * @throws Exception in case of a fatal error comming from
   *             the keeper.
   */
  this.register = function(order) {
    var result = null;
    var deferred = q.defer();
    var hasErrors = this.isValid(order);
    if (hasErrors.length === 0) {
      result = orderInterface.add(new Order(order));
      result['catch'](function (err) {
        console.log('OrderService.register: -Failed to create an order. ', err);
      });
    } else {
      console.log('OrderService.register: -Invalid order. ', hasErrors);
      result = deferred.reject(hasErrors);
    }
    return result;
  };

  /**
   * Returns the full orders list.
   *
   * @return Array - Orders list.
   */
 this.list = function() {
    var result = null;
    try {
      result = orderInterface.list();
    } catch (err) {
      console.log('OrderService.list: Unable to recover the list of orders. ' + 'Err=' + err);
    }
    return result;
  };

  /**
   * Returns a single order by its id.
   *
   * @param id - Order id.
   * @return {Order|null} The desired order;
   */
  this.read = function(id) {
    var result = null;
    try {
      result = orderInterface.read(id);
    } catch (err) {
      console.log('OrderService.read: Unable to find an order with the id=' + id + '. ' + 'Err=' + err);
    }
    return result;
  };

  /**
   * Cancels an order.
   *
   * @param id - Order id.
   * @return boolean Result if the receivable is canceled.
   */
  this.cancel = function(id) {
    var result = null;
    var deferred = q.defer();
    try {
      result = orderInterface.cancel(id);
      result['catch'](function (err) {
        console.log('OrderService.cancel: -Failed to cancel an order. ', err);
      });
    } catch (err) {
      console.log('OrderService.cancel: Unable to cancel the order with id=' + id + '. ' + 'Err=' + err);
      result = deferred.reject(err);
    }
    return result;
  };

  /**
   * Updates an order.
   *
   * @param id - Order id.
   * @param itens - New items to update
   * @return boolean Result if the receivable is canceled.
   */
  this.update = function(id, items) {
    var result = null;
    var deferred = q.defer();
    try {
      result = orderInterface.update(id, items);
      result['catch'](function (err) {
        console.log('OrderService.update: -Failed to update an order. ', err);
      });
    } catch (err) {
      console.log('OrderService.update: Unable to update the order with id=' + id + '. ' + 'Err=' + err);
      result = deferred.reject(err);
    }
    return result;
  };

  /**
   * Updates the item qty of an order.
   *
   * @param uuid - Order uuid
   * @param itens - New items to update
   * @return promise with the result.
   */
  this.updateItemQty = function (uuid, items) {
      var promise = null;
      var deferred = q.defer();

      promise = orderInterface.updateItemQty(uuid, items);

      return promise.then(function () {
        console.log('Order items updated with succes!');
      }, function (err) {
        return deferred.reject(console.log('OrderService.update: Unable to update the order with id=' + uuid + '. ' +
          'Err=' + err));
      });
    };

  /**
   * Adds the current order to the list of orders.
   */
  // NOTE: This method saves a COPY of the actual order. If
  // the
  // order
  // is changed between the calls to save() and clear(), this
  // changes
  // will be lost.
  //
  // NOTE: This DOES NOT clears the current order
  // automatically.
  this.save = function() {
    // Removes items without quantity
    var selectedItems = [];
    for (var idx in order.items) {
      var item = order.items[idx];
      if (item.qty) {
        selectedItems.push(item);
      }
    }

    //I replaced the angular copy with a new Order creation,
    // because underscore doesn't have a deep copy.
    //I'm not sure if it will cause problems in the future.
    var savedOrder = new Order(order);
    savedOrder.date = new Date();
    savedOrder.items = selectedItems;

    return this.register(savedOrder);
  };

  /**
   * Reset the current order.
   */
  this.clear = function() {
    // Reset the current order to an empty object.
    for (var idx in order) {
      if (order.hasOwnProperty(idx)) {
        delete order[idx];
      }
    }

    initOrder();
  };

  // ===========================================
  // Helpers
  // ===========================================

  /**
   * Initializes a new order object based on the template.
   *
   * NOTE: it's not garanteed that the order will be reset
   * after calling this function. Use clear() if that's what
   * you need.
   */
  function initOrder() {
    _.extend(order, orderTemplate);
    order.items = [];
  }
  initOrder();

  /**
   * Checks if a value is a boolean.
   *
   * @param {*} val Value to be checked.
   */
  function isBoolean(val) {
    return val === true || val === false;
  }

  /**
   * Checks if the given id is a valid customer id.
   *
   * @param {*} id The customer id to be validated.
   */
  function isValidCustomerId(id) {
    // FIXME - Validate if is a real entityId
    var result = false;
    if(id){
      result = true;
    }else{
      result = false;
    }
    return result;
  }

  /**
   * Checks if the given array contains only valid items.
   *
   * @param {*} items Array of items to validate.
   */
    // FIXME: implement proper items validation
  function areValidItems(items) {
    return _.isArray(items) && items.length > 0;
  }
}

module.exports = OrderService;