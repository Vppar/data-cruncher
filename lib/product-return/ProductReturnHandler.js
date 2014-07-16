'use strict';

var ProductReturn = require('./ProductReturn.js');
var ObjectUtils = require('./../handlers/ObjectUtils.js');

function ProductReturnHandler() {

  this.productsReturned = [];
  this.handlers = {};
  var that = this;


  /**
   * <pre>
   * @spec ProductReturnKeeper.handlers.productReturnAddV1#1
   * Given a valid event
   * and an existing devoltutionId
   * when an add is triggered
   * then the position must be updated
   *
   * @spec ProductReturnKeeper.handlers.productReturnAddV1#2
   * Given a valid event
   * and a non existent productId
   * when an add is triggered
   * the a new entry must be added
   * and it must be an instance of ReturnProduct
   *
   * @spec ProductReturnKeeper.handlers.productReturnAddV1#3
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
   * @param event - ProductReturn
   */
  ObjectUtils.ro(this.handlers, 'productReturnAddV1', function (event) {

    event = new ProductReturn(event);
    that.productsReturned.push(event);

    return event.id;
  });


// Nuke event for clearing the productsReturned list
  this.handlers.nukeProductsReturnedV1 = function () {
    that.productsReturned.length = 0;
    return true;
  };
}

module.exports = ProductReturnHandler;