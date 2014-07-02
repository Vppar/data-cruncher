var _ = require('underscore');
var ObjectUtils = require('./ObjectUtils.js');
var ArrayUtils = require('./ArrayUtils.js');
var Type = require('./../entities/Type.js');

function TypeHandler() {

    var types = {
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

    this.types = types;
    this.handlers = {};

    ObjectUtils.ro(this.handlers, 'typeAddV1', function (event) {

        var classList = types[event.classification];

        // if classification list not exists, create one!
        if (!classList) {
            types[event.classification] = [];
        }

        var entry = ArrayUtils.find(types[event.classification], 'id', event.id);

        if (entry === null) {

            var type = new Type(types[event.classification].length, event.name, event.classification);
            types[event.classification].push(type);

        } else {
            throw 'Somehow, we got a repeated type!?!?';
        }

    });
}

module.exports = TypeHandler;