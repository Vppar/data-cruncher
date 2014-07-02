var _ = require('underscore');
var ObjectUtils = require('./../handlers/ObjectUtils.js');

function Coin(uuid, created, entityId, amount, duedate) {

    var validProperties = [
        'uuid', 'created', 'entityId', 'documentId', 'type', 'payment', 'amount', 'duedate', 'canceled', 'liquidated', 'remarks', 'document', 'gatewayInfo', 'extInfo'
    ];

    ObjectUtils.method(Coin, 'isValid', function() {
        for ( var ix in this) {
            var prop = this[ix];
            if (!_.isFunction(prop)) {
                if (validProperties.indexOf(ix) === -1) {
                    throw 'Unexpected property ' + ix;
                }
            }
        }
    });

    if (arguments.length !== Coin.length) {
        if (arguments.length === 1 && _.isObject(arguments[0])) {
            Coin.prototype.isValid.apply(arguments[0]);
            ObjectUtils.dataCopy(this, arguments[0]);
        } else {
            throw 'Coin must be initialized with uuid, created, entityId, amount, duedate';
        }
    } else {
        this.uuid = uuid;
        this.created = created;
        this.entityId = entityId;
        this.amount = amount;
        this.duedate = duedate;
    }
    ObjectUtils.ro(this, 'uuid', this.uuid);
    ObjectUtils.ro(this, 'created', this.created);
    ObjectUtils.ro(this, 'entityId', this.entityId);
};

module.exports = Coin;