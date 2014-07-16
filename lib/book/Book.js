'use strict';

var _ = require('underscore');
var ObjectUtils = require('../handlers/ObjectUtils.js');

function Book(uuid, access, name, type, nature, entities) {

    var validProperties = [
        'uuid', 'access', 'name', 'type', 'nature', 'entities', 'balance'
    ];
    ObjectUtils.method(Book, 'isValid', function () {
        for (var ix in this) {
            var prop = this[ix];
            if (!_.isFunction(prop)) {
                if (validProperties.indexOf(ix) === -1) {
                    throw Error('Unexpected property ' + ix);
                }
            }
        }
    });

    if (arguments.length !== Book.length) {
        if (arguments.length === 1 && _.isObject(arguments[0])) {
            Book.prototype.isValid.apply(arguments[0]);
            ObjectUtils.dataCopy(this, arguments[0]);
        } else {
            throw Error('Book must be initialized with access, name, type, nature, entities.');
        }
    } else {
        this.uuid = uuid;
        this.access = access;
        this.name = name;
        this.type = type;
        this.nature = nature;
        this.entities = entities;
        this.balance = 0;
    }
}

module.exports = Book;