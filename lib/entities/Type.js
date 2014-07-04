'use strict';

var _ = require('underscore');
var ObjectUtils = require('../handlers/ObjectUtils.js');

function Type(id, name, classification) {

    var validProperties = [
        'id', 'name', 'classification'
    ];

    ObjectUtils.method(Type, 'isValid', function() {
        for ( var ix in this) {
            var prop = this[ix];

            if (!_.isFunction(prop)) {
                if (validProperties.indexOf(ix) === -1) {
                    throw Error('Unexpected property ' + ix);
                }
            }
        }
    });

    if (arguments.length !== Type.length) {
        if (arguments.length === 1 && _.isObject(arguments[0])) {
            Type.prototype.isValid.apply(arguments[0]);
            ObjectUtils.dataCopy(this, arguments[0]);
        } else {
            throw Error('Type must be initialized with typeId, name and classification');
        }
    } else {
        this.id = id;
        this.name = name;
        this.classification = classification;
    }
    ObjectUtils.ro(this, 'id', this.id);
    ObjectUtils.ro(this, 'name', this.name);
    ObjectUtils.ro(this, 'classification', this.classification);
}

module.exports = Type;