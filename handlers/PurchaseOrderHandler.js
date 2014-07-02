var _ = require('underscore');
var ObjectUtils = require('./ObjectUtils.js');
var ArrayUtils = require('./ArrayUtils.js');
var PurchaseOrder = require('./../entities/PurchaseOrder.js');
var TypeHandler = require('./../handlers/TypeHandler.js');

function PurchaseOrderHandler() {

    var purchases = [];
    this.purchases = purchases;

    var status = new TypeHandler().types.purchaseOrderStatus;

    var STATUS_STASHED = ArrayUtils.find(status, 'name', 'stashed')['id'];
    var STATUS_CANCELED = ArrayUtils.find(status, 'name', 'canceled')['id'];
    var STATUS_CONFIRMED = ArrayUtils.find(status, 'name', 'confirmed')['id'];
    var STATUS_PARC_REC = ArrayUtils.find(status, 'name', 'partiallyReceived')['id'];
    var STATUS_RECEIVED = ArrayUtils.find(status, 'name', 'received')['id'];

    var _this = this;

    this.handlers = {};

// ############################################################################################################
// Handlers V1
// ############################################################################################################

// Nuke event for clearing the purchases list
    ObjectUtils.ro(this.handlers, 'nukePurchasesV1', function () {
        purchases.length = 0;
        return true;
    });

    ObjectUtils.ro(this.handlers, 'purchaseOrderAddV1', function (event) {
        // There wasn't update or status fields
        event.updated = event.created;
        event.status = STATUS_CONFIRMED;

        return _this.handlers.purchaseOrderAddV2(event);
    });

    ObjectUtils.ro(this.handlers, 'purchaseOrderRedeemV1', function (event) {
        event.status = STATUS_RECEIVED;
        event.updated = event.received;

        return _this.handlers.purchaseOrderReceiveV2(event);
    });

    ObjectUtils.ro(this.handlers, 'purchaseOrderReceiveV1', function (event) {
        event.status = STATUS_PARC_REC;

        return _this.handlers.purchaseOrderReceiveProductV2(event);
    });

// ############################################################################################################
// Handlers V2
// ############################################################################################################

    ObjectUtils.ro(this.handlers, 'purchaseOrderAddV2', function (event) {
        var eventData = IdentityService.getUUIDData(event.uuid);

        if (eventData.deviceId === IdentityService.getDeviceId()) {
            currentCounter = currentCounter >= eventData.id ? currentCounter : eventData.id;
        }

        event = new PurchaseOrder(event);
        purchases.push(event);

        return event.uuid;
    });

    ObjectUtils.ro(this.handlers, 'purchaseOrderUpdateV2', function (event) {
        var purchaseEntry = ArrayUtils.find(purchases, 'uuid', event.uuid);

        purchaseEntry.updated = event.updated;
        purchaseEntry.amount = event.amount;
        purchaseEntry.discount = event.discount;
        purchaseEntry.freight = event.freight;
        purchaseEntry.points = event.points;
        purchaseEntry.items = event.items;
        purchaseEntry.cost = event.cost;

        return event.uuid;
    });

    ObjectUtils.ro(this.handlers, 'purchaseOrderChangeStatusV2', function (event) {
        var purchaseEntry = ArrayUtils.find(purchases, 'uuid', event.uuid);

        var status = {
            uuid: event.uuid,
            from: purchaseEntry.status,
            to: event.status
        };

        purchaseEntry.status = event.status;
        purchaseEntry.updated = event.updated;

        return status;
    });

    ObjectUtils.ro(this.handlers, 'purchaseOrderCancelV2', function (event) {
        var purchaseEntry = ArrayUtils.find(purchases, 'uuid', event.uuid);

        purchaseEntry.updated = event.updated;
        purchaseEntry.canceled = event.canceled;
        purchaseEntry.status = event.status;

        return event.uuid;
    });

    ObjectUtils.ro(this.handlers, 'purchaseOrderReceiveV2', function (event) {
        var purchaseEntry = ArrayUtils.find(purchases, 'uuid', event.uuid);

        purchaseEntry.updated = event.updated;
        purchaseEntry.received = event.received;
        purchaseEntry.status = event.status;
        purchaseEntry.nfeNumber = event.nfeNumber;

        return event.uuid;
    });

    ObjectUtils.ro(this.handlers, 'purchaseOrderReceiveProductV2', function (event) {
        var purchaseEntry = ArrayUtils.find(purchases, 'uuid', event.uuid);

        var receive = {};

        receive.productId = event.productId;
        receive.nfeNumber = event.nfeNumber;
        receive.extNumber = event.extNumber;
        receive.received = event.received;
        receive.qty = event.qty;

        purchaseEntry.itemsReceived.push(receive);
        purchaseEntry.extNumber = event.extNumber;
        purchaseEntry.status = event.status;
        purchaseEntry.updated = event.updated;

        return receive.productId;
    });
}

module.exports = PurchaseOrderHandler;