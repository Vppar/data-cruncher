'use strict';

var ProductReturn = require('./ProductReturn.js');
var ArrayUtils = require('../handlers/ArrayUtils.js');
var q = require('q');

function ProductReturnService(productReturnInterface, stockInterface) {

  var that = this;

  // FIXME - make it validate!
  var isValid = function() {
    var result = [];
    return result;
  };

  this.register = function(productReturn) {
    var result = null;
    var deferred = q.defer();
    var hasErrors = isValid(productReturn);
    if (hasErrors.length === 0) {
      result = productReturnInterface.add(new ProductReturn(productReturn));
      result['catch'](function(err) {
        console.log('ProductReturnService.register: -Failed to create a productReturn. ', err);
      });
    } else {
      console.log('ProductReturnService.register: -Invalid productReturn. ', hasErrors);
      result = deferred.reject(hasErrors);
    }

    return result.then(function() {
      // add an item to stock.
      var stockItem = {
        inventoryId : productReturn.productId,
        quantity : productReturn.quantity,
        cost : productReturn.cost
      };

      return stockInterface.add(stockItem);
    });
  };

 this.bulkRegister = function(exchanges, entity, document) {
    var exchangesPromises = [];
    var deferred = q.defer();
    for ( var ix in exchanges) {
      var exchange = exchanges[ix];
      // FIXME maybe review this
      if (exchange.amount > 0) {

        var productReturn = new ProductReturn({
          id : exchange.id,
          productId : exchange.productId,
          documentId : document,
          quantity : exchange.qty,
          cost : exchange.price
        });

        exchangesPromises[ix] = that.register(productReturn);
      } else {
        console.log('Product return will be ignored because its amount is 0: ' + JSON.stringify(exchange));
      }
    }
    return deferred.all(exchangesPromises);
  };

  this.list = function() {
    return productReturnInterface.list();
  };

  /**
   * Returns the full receivables list.
   *
   * @return Array - Receivables list.
   */
  this.listByDocument = function(document) {
    var result = null;
    try {
      result = ArrayUtils.list(productReturnInterface.list(), 'documentId', document);
    } catch (err) {
      console.log('ProductReturnKeeper.list: Unable to recover the list of receivables. Err=' + err);
    }
    return result;
  };
}

module.exports = ProductReturnService;