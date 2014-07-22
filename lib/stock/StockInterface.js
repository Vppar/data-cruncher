'use strict';

var ObjectUtils = require('../handlers/ObjectUtils.js');
var ArrayUtils = require('../handlers/ArrayUtils.js');
var Stock = require('./Stock.js');
var MasterKeeper = require('../keepers/MasterKeeper.js');
var q = require('q');

function StockInterface(journalKeeper, stockHandler) {

  var currentEventVersion = 1;

  ObjectUtils.superInvoke(this, journalKeeper, 'Stock', Stock, currentEventVersion);

  this.add = function (stock) {

    var deferred = q.defer();

    if (!(stock instanceof this.eventType)) {
      return deferred.reject('Wrong instance of Stock');
    }

    return this.journalize('Add', stock);

  };

  /**
   *
   * <pre>
   * @spec StockKeeper.remove#1
   * Given a valid productId
   * and a positive quantity
   * when and add is triggered
   * then a journal entry must be created
   * an the entry must be registered
   *
   * @spec StockKeeper.remove#2
   * Given a negative quantity
   * when and add is triggered
   * then an error must be raised
   *
   * </pre>
   *
   * Register a removal of products from stock
   *
   * @param productId - The id for the product we are fiddling with
   * @param quantity - the number of units we are pulling out
   */
  this.remove = function (inventoryId, quantity) {

    var deferred = q.defer();

    var entry = ArrayUtils.find(stockHandler.stock, 'inventoryId', inventoryId);
    if (entry === null) {
      return deferred.reject('No stockable found with this inventoryId: ' + inventoryId);
    }

    var event = new Stock(inventoryId, quantity, null);

    return this.journalize('Remove', event);

  };

  /**
   * Set a quantity of products as reserved
   */
  this.reserve = function (inventoryId, reserve) {

    var event = new Stock(inventoryId, null, null);
    event.reserve = reserve;

    return this.journalize('Reserve', event);

  };

  /**
   * Unset a quantity of products as reserved
   */
  this.unreserve = function (inventoryId, reserve) {

    var deferred = q.defer();

    var entry = ArrayUtils.find(stockHandler.stock, 'inventoryId', inventoryId);
    if (entry === null) {
      return deferred.reject('No stockable found with this inventoryId: ' + inventoryId);
    }

    var event = new Stock(inventoryId, null, null);
    event.reserve = reserve;

    return this.journalize('Unreserve', event);

  };
}

ObjectUtils.inherit(StockInterface, MasterKeeper);

module.exports = StockInterface;