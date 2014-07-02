var _ = require('underscore');
var ObjectUtils = require('./../handlers/ObjectUtils.js');

function ProductReturn(id, productId, documentId, quantity, cost) {

    var validProperties = [
        'id', 'productId', 'documentId', 'quantity', 'cost', 'created'
    ];
    ObjectUtils.method(ProductReturn, 'isValid', function() {
        for ( var ix in this) {
            var prop = this[ix];
            if (!_.isFunction(prop)) {
                if (validProperties.indexOf(ix) === -1) {
                    throw 'Unexpected property ' + ix;
                }
            }
        }
    });
    if (arguments.length !== ProductReturn.length) {
        if (arguments.length === 1 && _.isObject(arguments[0])) {
            ProductReturn.prototype.isValid.apply(arguments[0]);
            ObjectUtils.dataCopy(this, arguments[0]);
        } else {
            throw 'ProductReturn must be initialized with id, productId, documentId, quantity and cost';
        }
    } else {
        this.id = id;
        this.productId = productId;
        this.documentId = documentId;
        this.quantity = quantity;
        this.cost = cost;
    }
    ObjectUtils.ro(this, 'id', this.id);

}

module.exports = ProductReturn;
