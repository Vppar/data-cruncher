var _ = require('underscore');
var ObjectUtils = require('./../handlers/ObjectUtils.js');

function BookEntry(uuid, created, debitAccount, creditAccount, document, entity, op, amount) {

    var validProperties = [
        'uuid', 'created', 'debitAccount', 'creditAccount', 'document', 'entity', 'op', 'remark', 'amount'
    ];

    ObjectUtils.method(BookEntry, 'isValid', function() {
        for ( var ix in this) {
            var prop = this[ix];
            if (!_.isFunction(prop)) {
                if (validProperties.indexOf(ix) === -1) {
                    throw 'Unexpected property ' + ix;
                }
            }
        }
    });

    if (arguments.length != BookEntry.length) {
        if (arguments.length === 1 && _.isObject(arguments[0])) {
            BookEntry.prototype.isValid.apply(arguments[0]);
            ObjectUtils.dataCopy(this, arguments[0]);
        } else {
            throw 'BookEntry must be initialized with uuid, created, debitAccount, creditAccount, document, entity, op, amount';
        }
    } else {
        this.uuid = uuid;
        this.created = created;
        this.debitAccount = debitAccount;
        this.creditAccount = creditAccount;
        this.document = document;
        this.entity = entity;
        this.op = op;
        this.amount = amount;
    }
};

module.exports = BookEntry;