'use strict';

var ObjectUtils = require('../handlers/ObjectUtils.js');
var ProductReturn = require('./ProductReturn.js');
var ArrayUtils = require('../handlers/ArrayUtils.js');
var MasterKeeper = require('../keepers/MasterKeeper.js');

function ProductReturnInterface(journalKeeper, productReturnHandler) {

  var currentEventVersion = 1;

  ObjectUtils.superInvoke(this, journalKeeper, 'ProductReturnInterface', ProductReturnInterface, currentEventVersion);

  this.add = function (productReturn) {
    var prodReturnObj = new ProductReturn(productReturn);

    prodReturnObj.created = (new Date()).getTime();

    // save the journal entry
    return this.journalize('Add', prodReturnObj);
  };

  this.read = function (uuid) {
    var product = ArrayUtils.find(productReturnHandler.productsReturned, 'uuid', uuid);
    return product;
  };

  this.list = function () {
    var products = [].concat(productReturnHandler.productsReturned);
    return products;
  };

}

ObjectUtils.inherit(ProductReturnInterface, MasterKeeper);

module.exports = ProductReturnInterface;
