var _ = require('underscore');
var ObjectUtils = require('./../handlers/ObjectUtils.js');

function Entity (uuid, name, emails, birthDate, phones, cep, document, addresses,
              remarks) {

    var validProperties =
        [
            'uuid',
            'name',
            'emails',
            'birthDate',
            'phones',
            'cep',
            'document',
            'addresses',
            'remarks',
            'created'
        ];

    ObjectUtils.method(Entity, 'isValid', function () {
        for ( var ix in this) {
            var prop = this[ix];

            if (!_.isFunction(prop)) {
                if (validProperties.indexOf(ix) === -1) {
                    throw 'Unexpected property ' + ix;
                }
            }
        }
    });

    if (arguments.length !== Entity.length) {
        if (arguments.length === 1 && _.isObject(arguments[0])) {
            Entity.prototype.isValid.apply(arguments[0]);
            ObjectUtils.dataCopy(this, arguments[0]);
        } else {
            throw 'Entity must be initialized with id, name, emails, birthDate, phones, cep, document, addresses,  remarks';
        }
    } else {
        this.uuid = uuid;
        this.name = name;
        this.emails = emails;
        this.birthDate = birthDate;
        this.phones = phones;
        this.cep = cep;
        this.document = document;
        this.addresses = addresses;
        this.remarks = remarks;

    }
    ObjectUtils.ro(this, 'uuid', this.uuid);
};

module.exports = Entity;