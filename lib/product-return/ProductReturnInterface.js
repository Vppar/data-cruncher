'use strict';

var ObjectUtils = require('../handlers/ObjectUtils.js');
var ProductReturn = require('./ProductReturn.js');
var MasterKeeper = require('../keepers/MasterKeeper.js');

function ProductReturnInterface(journalKeeper) {

  var currentEventVersion = 1;

  ObjectUtils.superInvoke(this, journalKeeper, 'ProductReturnInterface', ProductReturnInterface, currentEventVersion);

  this.add = function (productReturn) {
    var prodReturnObj = new ProductReturn(productReturn);

    prodReturnObj.created = (new Date()).getTime();

    // save the journal entry
    return this.journalize('Add', prodReturnObj);
  };

}

ObjectUtils.inherit(ProductReturnInterface, MasterKeeper);

module.exports = ProductReturnInterface;
