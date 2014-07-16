'use strict';

var ArrayUtils = require('./../handlers/ArrayUtils.js');
var Stock = require('./Stock.js');
var FinancialMathService = require('./../service/FinancialMathService.js');

function StockHandler() {

  this.stock = [];
  this.handlers = {};

  var that = this;

  /**
   * <pre>
   * @spec StockKeeper.handlers.stockAddV1#1
   * Given a valid event
   * and an existing productId
   * when an add is triggered
   * then the position must be updated
   * and the quantity must be the sum
   * and the price must be the average
   *
   * @spec StockKeeper.handlers.stockAddV1#2
   * Given a valid event
   * and a non existent productId
   * when an add is triggered
   * the a new entry must be added
   * and it must be an instance of Stock
   *
   * @spec StockKeeper.handlers.stockAddV1#3
   * Given an invalid event
   * when an add is triggered
   * then an error must be raised
   *
   * </pre>
   *
   * Add replay function for event version 1
   *
   * This function applies the changes received from the journal.
   *
   * @param event - something that resembles, but not necessarily is, an instance of Stock
   */
  this.handlers.stockAddV1 = function (event) {
    var entry = ArrayUtils.find(that.stock, 'inventoryId', event.inventoryId);
    var updatedInv = null;
    if (entry === null) {
      event = new Stock(event);
      updatedInv = event.quantity;

      that.stock.push(event);
    } else {
      updatedInv = entry.quantity + event.quantity;

      var oldCost = FinancialMathService.currencyMultiply(entry.quantity, entry.cost);
      var newCost = FinancialMathService.currencyMultiply(event.quantity, event.cost);
      var totalCost = FinancialMathService.currencySum(oldCost, newCost);
      var averageCost = FinancialMathService.currencyDivide(totalCost, updatedInv);

      entry.cost = averageCost;
      entry.quantity = updatedInv;
    }
    return updatedInv;
  };

// Nuke event for clearing the stock list
  this.handlers.nukeStockV1 = function () {
    that.stock.length = 0;
    return true;
  };

  /**
   * <pre>
   * @spec StockKeeper.handlers.stockRemoveV1#1
   * Given a valid event
   * and an existing productId
   * when a remove is triggered
   * then the entry quantity must be subtracted by the given amount
   *
   * @spec StockKeeper.handlers.stockRemoveV1#2
   * Given a valid event
   * and a non existing productId
   * when a remove is triggered
   * then an error must be raised
   *
   * </pre>
   *
   * Remove replay function for event version 1
   *
   * This function applies the changes received from the journal.
   *
   * @param event - something that resembles, but not necessarily is, an instance of Stock
   */
  this.handlers.stockRemoveV1 = function (event) {

    var entry = ArrayUtils.find(that.stock, 'inventoryId', event.inventoryId);

    if (entry === null) {
      throw Error('Entity not found, cosistency must be broken! Replay?');
    }
    entry.quantity -= event.quantity;

    return entry.quantity;
  };

  this.handlers.stockReserveV1 = function (event) {

    var entry = ArrayUtils.find(that.stock, 'inventoryId', event.inventoryId);

    if (entry === null) {
      entry = new Stock(event.inventoryId, 0, 0);
      that.stock.push(entry);
    }
    entry.reserve = entry.reserve ? entry.reserve : 0;
    entry.reserve += event.reserve;
    return entry.reserve;
  };

  this.handlers.stockUnreserveV1 = function (event) {

    var entry = ArrayUtils.find(that.stock, 'inventoryId', event.inventoryId);

    if (entry === null) {
      throw Error('Entity not found, cosistency must be broken! Replay?');
    }
    entry.reserve -= event.reserve;
    return entry.reserve;
  };
}

module.exports = StockHandler;