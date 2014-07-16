'use strict';

var _ = require('underscore');
var ObjectUtils = require('../handlers/ObjectUtils.js');

function PurchaseOrder(uuid, created, amount, discount, points, items) {

    var validProperties =
        [
            'uuid', 'created', 'updated', 'status', 'amount', 'cost', 'freight', 'discount', 'points', 'received',
            'nfeNumber', 'canceled', 'items', 'itemsReceived'
        ];
    ObjectUtils.method(PurchaseOrder, 'isValid', function() {
        for ( var ix in this) {
            var prop = this[ix];
            if (!_.isFunction(prop)) {
                if (validProperties.indexOf(ix) === -1) {
                    throw Error('PurchaseOrder: Unexpected property ' + ix);
                }
            }
        }
    });

    if (arguments.length !== PurchaseOrder.length) {
        if (arguments.length === 1 && _.isObject(arguments[0])) {
            PurchaseOrder.prototype.isValid.apply(arguments[0]);
            ObjectUtils.dataCopy(this, arguments[0]);
        } else {
            throw Error('PurchaseOrder must be initialized with uuid, created, amount, discount, points, items');
        }
    } else {
        this.uuid = uuid;
        this.created = created;
        this.amount = amount;
        this.discount = discount;
        this.points = points;
        this.items = items;
    }

    this.itemsReceived = [];

    ObjectUtils.ro(this, 'uuid', this.uuid);
    ObjectUtils.ro(this, 'created', this.created);
}

module.exports = PurchaseOrder;