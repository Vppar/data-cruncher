'use strict';

var _ = require('underscore');
var Schedule = require('./Scheduling.js');
var q = require('q');

function SchedulingService (schedulingInterface) {

  /**
   * Verifies if a order is valid.
   *
   * @param order - Order object to be validated
   * @return {Array} Array of objects containing the invalid
   *         properties
   */
  this.isValid = function(schedule) {
    var invalidProperty, result = [];
    var date = new Date(schedule.date);
    var created = new Date(schedule.created);
    // See validation helpers in the end of this file
    invalidProperty = {
      date : _.isDate(date),
      created : _.isDate(created),
      status : schedule.status === true || schedule.status === false,
      documentUUID : !_.isUndefined(schedule.documentUUID),
      items : areValidItems(schedule.items)
    };

    for ( var ix in invalidProperty) {
      if (invalidProperty.hasOwnProperty(ix)) {
        if (!invalidProperty[ix]) {
          // Create an empty object, set a property
          // with
          // the name of
          // the invalid property, fill it with the
          // invalid value and
          // add the result.
          var error = {};
          error[ix] = schedule[ix];
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
  this.create =
    function(documentUUID, date, items, status) {

      var deferred = q.defer();

      var result = null;
      var created = new Date().getTime();

      for(var ix in items){
        items[ix].deliveredDate = date.getTime();
      }

      var schedule =
        new Schedule(
          null,
          created,
          documentUUID,
          date.getTime(),
          status,
          items);
      var hasErrors = this.isValid(schedule);
      if (hasErrors.length === 0) {
        result = schedulingInterface.create(schedule);
      } else {
        console.log(
          'SchedulingService.create: -Invalid schedule. ',
          hasErrors);
        result = deferred.reject(hasErrors);
      }
      return result;
    };

  /**
   * Returns the full orders list.
   *
   * @return Array - Orders list.
   */
  this.list =
    function() {
      var result = null;
      try {
        result = schedulingInterface.list();
      } catch (err) {
        console.log('OrderService.list: Unable to recover the list of orders. ' +
            'Err=' + err);
      }
      return result;
    };

  /**
   * Returns a single order by its id.
   *
   * @param id - Order id.
   * @return {Order|null} The desired order;
   */
  this.readByDocument =
    function(id) {
      var result = null;
      try {
        result = schedulingInterface.readByDocument(id);
      } catch (err) {
        console.log('OrderService.read: Unable to find an order with the id=' +
            id + '. ' + 'Err=' + err);
      }
      return result;
    };
  /**
   * Returns a single order by its id.
   *
   * @param id - Order id.
   * @return {Order|null} The desired order;
   */
  this.readActiveByDocument =
    function(id) {
      var result = null;
      try {
        result = schedulingInterface.readActiveByDocument(id);
      } catch (err) {
        console.log('OrderService.read: Unable to find an order with the id=' +
            id + '. ' + 'Err=' + err);
      }
      return result;
    };

  this.readDeliveredByDocument =
    function(id) {
      var result = null;
      try {
        result = schedulingInterface.readDeliveredByDocument(id);
      } catch (err) {
        console.log('OrderService.read: Unable to find an order with the id=' +
            id + '. ' + 'Err=' + err);
      }
      return result;
    };

  /**
   * Returns a single order by its id.
   *
   * @param id - Order id.
   * @return {Order|null} The desired order;
   */
 this.read =
    function(id) {
      var result = null;
      try {
        result = schedulingInterface.read(id);
      } catch (err) {
        console.log('OrderService.read: Unable to find an order with the id=' +
            id + '. ' + 'Err=' + err);
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
  this.update =
    function(id, date, items, status) {

      var deferred = q.defer();

      for(var ix in items){
        var item = items[ix];
        if(item.qty !== item.dQty){
          item.deliveredDate = date.getTime();
        }
      }
      var result = null;
      try {
        result = schedulingInterface.update(id, date.getTime(), items, status);
        result['catch'](function (err) {
          console.log(
            'OrderService.update: -Failed to update an order. ',
            err);
        });
      } catch (err) {
        console.log('OrderService.update: Unable to update the order with id=' +
            id + '. ' + 'Err=' + err);
        result = deferred.reject(err);
      }
      return result;
    };


  //FIXME
  //Makes no sense
//  this.remove = function (uuid) {
//    var result = null;
//    var schedule = schedulingInterface.read(uuid);
//    var deferred = q.defer();
//    var hasErrors = this.isValid(schedule);
//    if (hasErrors.length === 0) {
//      var stockEntry = new Stock(item.inventoryId, item.quantity, item.cost);
//      result = stockInterface.remove(stockEntry.inventoryId, item.quantity);
//    } else {
//      console.log('StockService.remove: -Invalid item. ', hasErrors);
//      result = deferred.reject(hasErrors);
//    }
//    return result;
//  };

  // ===========================================
  // Helpers
  // ===========================================

  /**
   * Checks if the given array contains only valid items.
   *
   * @param {*} items Array of items to validate.
   */
    // FIXME: implement proper items validation
  function areValidItems (items) {
    return _.isArray(items) && items.length > 0;
  }
}

module.export = SchedulingService;