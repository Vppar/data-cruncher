'use strict';

var _ = require('underscore');
var Stock = require('./Stock.js');
var ArrayUtils = require('../handlers/ArrayUtils.js');
var q = require('q');

function StockService(stockInterface) {

  // ###############################################################################################
  // Public methods
  // ###############################################################################################

  this.isValid =
    function(item) {
      var invalidProperty = {};

      invalidProperty.inventoryId = !_.isUndefined(item.inventoryId);
      invalidProperty.quantity =
        !_.isUndefined(item.quantity) && _.isNumber(item.quantity) && item.quantity > 0;
      invalidProperty.quantity = _.isUndefined(item.cost) && _.isNumber(item.cost) && item.cost > 0;

      var result = [];

      for ( var ix in invalidProperty) {
        if (!invalidProperty[ix]) {
          // Create a new empty object, set a
          // property
          // with the name of the invalid
          // property,
          // fill it with the invalid value and
          // add to
          // the result
          var error = {};
          error[ix] = item[ix];
          result.push(error);
        }
      }

      return result;
    };

  this.add = function(item) {
    var result = null;
    var deferred = q.defer();
    var hasErrors = this.isValid(item);

    if (hasErrors.length === 0) {
      var stockEntry = new Stock(item.inventoryId, item.quantity, item.cost);
      result = stockInterface.add(stockEntry);
    } else {
      result = deferred.reject('StockService.add: -Invalid item. ', hasErrors);
    }
    return result;
  };

  this.remove = function(item) {
    var result = null;
    var deferred = q.defer();
    var hasErrors = this.isValid(item);

    if (hasErrors.length === 0) {
      var stockEntry = new Stock(item.inventoryId, item.quantity, item.cost);
      result = stockInterface.remove(stockEntry.inventoryId, item.quantity);
    } else {
      result = deferred.reject('StockService.remove: -Invalid item. ', hasErrors);
    }
    return result;
  };

  this.unreserve = function(item) {
    var result = null;
    var deferred = q.deferred();
    var hasErrors = this.isValid(item);

    if (hasErrors.length === 0) {
      var stockEntry = new Stock(item.inventoryId, item.quantity, item.cost);
      result = stockInterface.unreserve(stockEntry.inventoryId, item.quantity);
    } else {
      result = deferred('StockService.unreserve: -Invalid item. ', hasErrors);
    }
    return result;
  };

  this.reportAvailable = function(filter) {
    return this.stockReport('available', filter);
  };

  this.reportReserved = function(filter) {
    return this.stockReport('reserved', filter);
  };


  //TODO - not sure if this will be on the backend
//  this.stockReport = function(type, filter) {
//    // read inventory and stock
//    var inventory = InventoryKeeper.read();
//    var stock = stockInterface.list();
//
//    // kickstart to report
//    var report = {
//      total : {
//        amount : 0,
//        qty : 0,
//        avgCost : 0
//      },
//      sessions : {}
//    };
//
//    for ( var ix in inventory) {
//      // walk though all inventory items
//      var inventoryItem = inventory[ix];
//      // find the stock item
//      var stockItem = ArrayUtils.find(stock, 'inventoryId', inventoryItem.id);
//
//      // and merge it with stock
//      var reportItem = angular.copy(inventoryItem);
//      angular.extend(reportItem, angular.copy(stockItem));
//
//      // augment the reportItem with undefined
//      // protected reserve property and qty
//      ReportService.augmentReserveAndQty(type, reportItem, filter);
//
//      if (ReportService.shouldFilter(filter, reportItem) || ReportService.shouldSkip(type, reportItem)) {
//        continue;
//      }
//
//      var session = ReportService.buildSession(report, reportItem);
//      var line = ReportService.buildLine(session, reportItem);
//
//      report.total.qty += reportItem.qty;
//      report.total.amount += FinancialMathService.currencyMultiply(reportItem.cost, reportItem.qty);
//
//      line.items.push(reportItem);
//    }
//
//    report.total.avgCost = FinancialMathService.currencyDivide(report.total.amount, report.total.qty);
//
//    return report;
//  };
//
//  this.updateReport = function updateReport(stockReport, filter) {
//    // products
//    for ( var ix in stockReport.sessions) {
//      // sessions
//      var session = stockReport.sessions[ix];
//      // variables to session total and qty
//      var lineCount = 0;
//      // lines of that session
//      for ( var ix2 in session.lines) {
//        // lines
//        var line = session.lines[ix2];
//
//        // items of that line
//        var itemCount = 0;
//        for ( var ix3 in line.items) {
//          var item = line.items[ix3];
//          item.hide = ReportService.shouldFilter(filter, item);
//          if (!item.hide) {
//            itemCount++;
//          }
//        }
//        if (itemCount === 0) {
//          line.hide = true;
//        } else {
//          line.hide = false;
//          lineCount++;
//        }
//      }
//      session.hide = (lineCount === 0);
//    }
//  };

  this.findInStock = function(itemId) {
    var copyList = stockInterface.list();
    return ArrayUtils.find(copyList, 'inventoryId', itemId);
  };

}

module.exports = StockService;