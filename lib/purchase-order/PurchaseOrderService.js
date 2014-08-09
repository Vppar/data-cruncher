'use strict';

var _ = require('underscore');
var PurchaseOrder = require('./PurchaseOrder.js');
var Stock = require('../Stock/Stock.js');
var ArrayUtils = require('../handlers/ArrayUtils.js');
var FinancialMathService = require('../service/FinancialMathService.js');
var ReportService = require('../service/FinancialMathService.js');


var q = require('q');

function PurchaseOrderService(purchaseOrderHandler, stockInterface) {

  this.isValid = function isValid(order) {
    var invalidProperty, result = [];

    // See validation helpers in the end of this file
    invalidProperty = {
      items : areValidItems(order.items)
    };

    for ( var ix in invalidProperty) {
      if (invalidProperty.hasOwnProperty(ix)) {
        if (!invalidProperty[ix]) {
          var error = {};
          error[ix] = order[ix];
          result.push(error);
        }
      }
    }

    return result;
  };

  /**
   * register
   */
  this.register = function(purchase) {
    var result = null;
    var deferred = q.defer();
    var hasErrors = this.isValid(purchase);
    if (hasErrors.length === 0) {
      result = purchaseOrderHandler.add(new PurchaseOrder(purchase));
      result.then(function() {
        /**
         * <pre>
         * TODO - Uncomment and correct this section, we need to create a Expense.
         * var duedate = new Date();
         * var entityId = 0;
         * var expense = new Expense(null, new Date(), entityId, result.amount, duedate);
         * expense.documentId = uuid;
         * ExpenseService.register(expense);
         * </pre>
         */
      }, function(err) {
        console.log('PurchaseOrderService.register: -Failed to create an purchaseOrder. ', err);
      });
    } else {
      console.log('PurchaseOrderService.register: -Invalid purchaseOrder. ', hasErrors);
      result = deferred.reject(hasErrors);
    }

    return result;
  };

  /**
   * List all PurchaseOrders.
   */
  this.list = function() {
    var results = null;
    try {
      results = purchaseOrderHandler.list();
    } catch (err) {
      console.log('PurchaseOrderService.list: Unable to recover the list of purchaseOrders. ' + 'Err=' + err);
    }
    return results;
  };

  /**
   * Read a specific purchaseOrder
   */
  this.read =
    function(uuid) {
      var result = null;
      try {
        result = purchaseOrderHandler.read(uuid);
      } catch (err) {
        console.log('PurchaseOrderService.read: Unable to find an purchaseOrder with the uuid=' + uuid + '. ' +
          'Err=' + err);
      }
      return result;
    };

  this.receiveProduct =
    function(uuid, productId, nfeData, receivedQty) {
      var result = true;
      var numericProductId = Number(productId);
      try {
        var purchaseOrder = this.read(uuid);
        var purchasedProduct = ArrayUtils.find(purchaseOrder.items, 'id', numericProductId);
        var receivedProducts = ArrayUtils.list(purchaseOrder.itemsReceived, 'productId', numericProductId);

        if (receivedProducts.length > 0) {
          var purchasedQty = purchasedProduct.qty;
          var histReceivedQty = FinancialMathService.sum(receivedProducts, 'qty');

          if ((histReceivedQty + receivedQty) > purchasedQty) {
            throw Error('The deliver that is being informed is greater than the total ordered');
          }
        }
        result =
          purchaseOrderHandler.receiveProduct(
            uuid, numericProductId, nfeData.nfeNumber, nfeData.order, receivedQty);

        result = result.then(function(productId) {
          return stockInterface.add(new Stock(Number(productId), receivedQty, purchasedProduct.cost));
        });

      } catch (err) {
        throw Error('PurchaseOrderService.receive: Unable to receive the item with id=' + numericProductId +
          ' of the purchaseOrder with uuid=' + uuid + '. ' + 'Err=' + err);
      }
      return result;
    };

  this.filterReceived = function(purchaseOrder) {
    var result = new PurchaseOrder(purchaseOrder);
    for ( var i = 0; i < result.items.length;) {

      var item = result.items[i];
      var productReceivings = ArrayUtils.list(purchaseOrder.itemsReceived, 'productId', item.id);
      var receivedQty = FinancialMathService.sum(productReceivings, 'qty');
      item.qty = item.qty - receivedQty;
      if (item.qty === 0) {
        result.items.splice(i, 1);
      } else {
        i++;
      }
    }
    return result;
  };

  this.listPendingPurchaseOrders = function() {
    var purchaseOrders = this.list();
    var pending = [];

    for ( var i in purchaseOrders) {
      if (purchaseOrders[i].status === 4) {
        var filteredOrder = this.filterReceived(purchaseOrders[i]);
        if (filteredOrder.items.length > 0) {
          pending.push(filteredOrder);
        }
      }
    }
    return pending;
  };

  this.reportPending =
    function(filter) {
      var type = 'pending';
      var pendingOrders = this.listPendingPurchaseOrders();
      // kickstart to report
      var report = {
        total : {
          amount : 0,
          qty : 0,
          avgCost : 0
        },
        sessions : {}
      };

      for ( var ix in pendingOrders) {

        for ( var ix2 in pendingOrders[ix].items) {
          // walk though all inventory items
          var reportItem = pendingOrders[ix].items[ix2];

          if (pendingOrders[ix].itemsReceived && pendingOrders[ix].itemsReceived.length === 0 ||
            ReportService.shouldFilter(filter, reportItem)) {
            continue;
          }

          // augment the reportItem with undefined
          // protected reserve property and qty
          ReportService.augmentReserveAndQty(type, reportItem, filter);

          var session = ReportService.buildSession(report, reportItem);
          var line = ReportService.buildLine(session, reportItem);

          report.total.qty += reportItem.qty;
          report.total.amount += FinancialMathService.currencyMultiply(reportItem.cost, reportItem.qty);

          var foundItem = ArrayUtils.find(line.items, 'SKU', reportItem.SKU);
          if (foundItem) {
            foundItem.qty += reportItem.qty;
          } else {
            line.items.push(reportItem);
          }
        }
      }

      report.total.avgCost = FinancialMathService.currencyDivide(report.total.amount, report.total.qty);

      return report;
    };

  /**
   * Cancel a purchaseOrder
   */
  this.cancel =
    function(uuid) {
      var result = true;
      try {
        result = purchaseOrderHandler.cancel(uuid);
      } catch (err) {
        throw Error('PurchaseOrderService.cancel: Unable to cancel the purchaseOrder with uuid=' + uuid + '. ' +
          'Err=' + err);
      }
      return result;
    };

  /**
   * Redeem a purchaseOrder
   */
  this.receive =
    function(uuid, extNumber) {
      var result = null;
      var redeemed = true;
      try {
        var purchaseOrder = this.read(uuid);
        for ( var ix in purchaseOrder.items) {
          var item = purchaseOrder.items[ix];
          var receivedProducts = ArrayUtils.list(purchaseOrder.itemsReceived, 'productId', item.id);
          var receivedQty = FinancialMathService.sum(receivedProducts, 'qty', item.id);

          if (item.qty !== receivedQty) {
            redeemed = false;
            break;
          }
        }
        if (redeemed) {
          result = purchaseOrderHandler.receive(uuid, extNumber);
        } else {
          var deferred = q.defer();
          deferred.resolve('PurchaseOrderService.redeem: Purchase order not fully received.');
          result = deferred.promise;
        }
      } catch (err) {
        deferred.reject('PurchaseOrderService.redeem: Unable to redeem the purchaseOrder with uuid=' + uuid + '. ' +
          'Err=' + err);
      }
      return result;
    };

  // ===========================================
  // Helpers
  // ===========================================

  /**
   * Checks if the given array contains only valid items.
   *
   * @param {*} items Array of items to validate.
   */
  function areValidItems(items) {
    return _.isArray(items) && items.length > 0;
  }
}

module.exports = PurchaseOrderService;