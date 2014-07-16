'use strict';

var _ = require('underscore');
var ObjectUtils = require('../handlers/ObjectUtils.js');

function Check(uuid, bank, agency, account, number, duedate, amount) {

    var validProperties = [
        'uuid', 'bank', 'agency', 'account', 'number', 'duedate', 'amount', 'document'
    ];

    ObjectUtils.method(Check, 'isValid', function() {
        for ( var ix in this) {
            var prop = this[ix];

            if (!_.isFunction(prop)) {
                if (validProperties.indexOf(ix) === -1) {
                    throw Error('Unexpected property ' + ix);
                }
            }
        }
    });

    if (arguments.length !== Check.length) {
        if (arguments.length === 1 && _.isObject(arguments[0])) {
            Check.prototype.isValid.apply(arguments[0]);
            ObjectUtils.dataCopy(this, arguments[0]);
        } else {
            throw Error('Check must be initialized with uuid, bank, agency, account, number, duedate and amount');
        }
    } else {
        this.uuid = uuid;
        this.bank = bank;
        this.agency = agency;
        this.account = account;
        this.number = number;
        this.duedate = duedate;
        this.amount = amount;
    }

    ObjectUtils.ro(this, 'uuid', this.uuid);
    ObjectUtils.ro(this, 'bank', this.bank);
    ObjectUtils.ro(this, 'agency', this.agency);
    ObjectUtils.ro(this, 'account', this.account);
    ObjectUtils.ro(this, 'number', this.number);
    ObjectUtils.ro(this, 'duedate', this.duedate);
    ObjectUtils.ro(this, 'amount', this.amount);
}

module.exports = Check;