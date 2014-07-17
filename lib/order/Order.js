'use strict';

var _ = require('underscore');
var ObjectUtils = require('../handlers/ObjectUtils.js');

function Order(uuid, code, date, canceled, customerId, items) {

    var validProperties =
        [
            'uuid',
            'created',
            'code',
            'date',
            'canceled',
            'customerId',
            'updated',
            'items',
            'itemDiscount',
            'orderDiscount'
        ];

    ObjectUtils.method(Order, 'isValid', function () {
        for (var ix in this) {
            var prop = this[ix];
            if (!_.isFunction(prop)) {
                if (validProperties.indexOf(ix) === -1) {
                    throw Error('Unexpected property ' + ix);
                }
            }
        }
    });

    if (arguments.length !== Order.length) {
        if (arguments.length === 1 && _.isObject(arguments[0])) {
            Order.prototype.isValid.apply(arguments[0]);
            ObjectUtils.dataCopy(this, arguments[0]);
        } else {
            throw Error('Order must be initialized with uuid, code, date, canceled, customerId, items');
        }
    } else {
        this.uuid = uuid;
        this.code = code;
        this.date = date;
        this.canceled = canceled;
        this.customerId = customerId;
        this.items = items;
    }
    ObjectUtils.ro(this, 'uuid', this.uuid);
    ObjectUtils.ro(this, 'code', this.code);
    ObjectUtils.ro(this, 'date', this.date);
    ObjectUtils.ro(this, 'customerId', this.customerId);
}

module.exports = Order;