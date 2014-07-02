var _ = require('underscore');
var ObjectUtils = require('./../handlers/ObjectUtils.js');

function Stock(inventoryId, quantity, cost) {

    var validProperties = [
        'inventoryId', 'quantity', 'cost', 'reserve'
    ];

    ObjectUtils.method(Stock, 'isValid', function() {
        for ( var ix in this) {
            var prop = this[ix];

            if (!_.isFunction(prop)) {
                if (validProperties.indexOf(ix) === -1) {
                    throw "Unexpected property " + ix;
                }
            }
        }
    });

    if (arguments.length != Stock.length) {
        if (arguments.length === 1 && _.isObject(arguments[0])) {
            Stock.prototype.isValid.apply(arguments[0]);
            ObjectUtils.dataCopy(this, arguments[0]);
        } else {
            throw 'Stock must be initialized with inventoryId, quantity and cost';
        }
    } else {
        this.inventoryId = inventoryId;
        this.quantity = quantity;
        this.cost = cost;
        this.reserve = 0;
    }
    ObjectUtils.ro(this, 'inventoryId', this.inventoryId);
}

module.exports = Stock;