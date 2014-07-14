'use strict';

var ArrayUtils = require('./ArrayUtils.js');
var Type = require('./../entities/Type.js');

function TypeHandler() {

  this.types = {
    document: [
      {
        name: 'Pedido',
        id: 1
      },
      {
        name: 'Cheque',
        id: 2
      },
      {
        name: 'Contas a recebe',
        id: 3
      }
    ],
    classification: [
      {
        name: 'vendas de produtos',
        id: 1
      },
      {
        name: 'receitas diversas',
        id: 2
      },
      {
        name: 'acrescimo s/ recebimentos',
        id: 3
      }
    ],
    purchaseOrderStatus: [
      {
        name: 'stashed',
        id: 1
      },
      {
        name: 'canceled',
        id: 2
      },
      {
        name: 'confirmed',
        id: 3
      },
      {
        name: 'partiallyReceived',
        id: 4
      },
      {
        name: 'received',
        id: 5
      }
    ]
  };
  this.handlers = {};
  var that = this;

  this.handlers.typeAddV1 = function (event) {

    var classList = that.types[event.classification];

    // if classification list not exists, create one!
    if (!classList) {
      that.types[event.classification] = [];
    }

    var entry = ArrayUtils.find(that.types[event.classification], 'id', event.id);

    if (entry === null) {

      var type = new Type(that.types[event.classification].length, event.name, event.classification);
      that.types[event.classification].push(type);

    } else {
      throw Error('Somehow, we got a repeated type!?!?');
    }

  };
}

module.exports = TypeHandler;