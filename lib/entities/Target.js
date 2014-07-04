'use strict';

var _ = require('underscore');
var ObjectUtils = require('../handlers/ObjectUtils.js');

function Target(uuid, targets, type, totalAmount, name) {

    var validProperties = [
        'uuid', 'targets', 'type', 'totalAmount', 'name'
    ];

    ObjectUtils.method(Target, 'isValid', function () {
        for (var ix in this) {
            var prop = this[ix];
            if (!_.isFunction(prop)) {
                if (validProperties.indexOf(ix) === -1) {
                    throw Error('Unexpected property ' + ix);
                }
            }
        }
    });

    if (arguments.length !== Target.length) {
        if (arguments.length === 1 && _.isObject(arguments[0])) {
            Target.prototype.isValid.apply(arguments[0]);
            ObjectUtils.dataCopy(this, arguments[0]);
        } else {
            throw Error('Target must be initialized with uuid, targets, type, totalAmount, name');
        }
    } else {
        this.uuid = uuid;
        this.targets = targets;
        this.type = type;
        this.totalAmount = totalAmount;
        this.name = name;
    }

    ObjectUtils.ro(this, 'uuid', this.uuid);
    ObjectUtils.ro(this, 'targets', this.targets);
    ObjectUtils.ro(this, 'type', this.type);
    ObjectUtils.ro(this, 'totalAmount', this.totalAmount);
    ObjectUtils.ro(this, 'name', this.name);
}

module.exports = Target;