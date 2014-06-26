var _ = require('underscore');
var ObjectUtils = require('./ObjectUtils.js');
var ArrayUtils = require('./ArrayUtils.js');
var Order = require('./Order.js');

function OrderHandler() {

    var orders = [];
    this.handlers = {};
    this.orders = orders;

    /**
     * Registering handlers
     */
    ObjectUtils.ro(this.handlers, 'orderAddV1', function (event) {
        event = new Order(event);
        orders.push(event);

        return event.uuid;
    });

    ObjectUtils.ro(this.handlers, 'orderCancelV1', function (event) {
        var orderEntry = ArrayUtils.find(orders, 'uuid', event.id);
        if (orderEntry) {
            orderEntry.canceled = event.canceled;
        } else {
            throw 'Unable to find an order with uuid=\'' + event.uuid + '\'';
        }
    });

    ObjectUtils.ro(this.handlers, 'orderUpdateV1', function (event) {
        var orderEntry = ArrayUtils.find(orders, 'uuid', event.uuid);
        if (orderEntry) {
            orderEntry.items = event.items;
            orderEntry.updated = event.updated;
        } else {
            throw 'Unable to find an order with uuid=\'' + event.uuid + '\'';
        }
    });

    ObjectUtils.ro(this.handlers, 'orderUpdateItemQtyV1', function (event) {
        var orderEntry = ArrayUtils.find(orders, 'uuid', event.uuid);

        if (orderEntry) {
            for (var ix in event.items) {
                // var item = ArrayUtils.find(orderEntry.items, 'id',
                // event.items[ix].id);
                // FIXME this workround exists because couse
                // payment-discount.js set an id property to voucher
                // and gifts cards.
                var item = _.find(orderEntry.items, function (item) {
                    var result = false;
                    if (!item.type && item.id === event.items[ix].id) {
                        result = true;
                    }
                    return result;
                });

                if (!item.dQty) {
                    item.dQty = 0;
                }
                item.dQty += event.items[ix].dQty;
            }
        } else {
            throw 'Unable to find an order with uuid=\'' + event.uuid + '\'';
        }
    });

    // Nuke event for clearing the orders list
    ObjectUtils.ro(this.handlers, 'nukeOrdersV1', function () {
        orders.length = 0;
        return true;
    });
}

module.exports = OrderHandler;