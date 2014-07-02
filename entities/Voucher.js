var _ = require('underscore');
var ObjectUtils = require('./../handlers/ObjectUtils.js');

function Voucher(id, entity, type, amount) {

    var validProperties =
        [
            'id',
            'entity',
            'type',
            'amount',
            'redeemed',
            'canceled',
            'created',
            'remarks',
            'documentId',
            'origin'
        ];

    ObjectUtils.method (Voucher, 'isValid', function( ) {
        for ( var ix in this) {
            var prop = this[ix];

            if (!_.isFunction (prop)) {
                if (validProperties.indexOf (ix) === -1) {
                    throw 'Unexpected property ' + ix;
                }
            }
        }
    });

    if (arguments.length !== Voucher.length) {
        if (arguments.length === 1 && _.isObject (arguments[0])) {
            Voucher.prototype.isValid.apply (arguments[0]);
            ObjectUtils.dataCopy (this, arguments[0]);
        } else {
            throw 'Voucher must be initialized with id, entity, type and amount';
        }
    } else {
        this.id = id;
        this.entity = entity;
        this.type = type;
        this.amount = amount;
    }

    ObjectUtils.ro (this, 'id', this.id);
    ObjectUtils.ro (this, 'entity', this.entity);
    ObjectUtils.ro (this, 'type', this.type);
    ObjectUtils.ro (this, 'amount', this.amount);
}

module.exports = Voucher;