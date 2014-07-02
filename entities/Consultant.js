var _ = require('underscore');
var ObjectUtils = require('./../handlers/ObjectUtils.js');

function Consultant (uuid, name, mkCode, cep, address, cpf, bank, agency, account,
              email) {

    var validProperties =
        [
            'uuid',
            'name',
            'mkCode',
            'cep',
            'address',
            'cpf',
            'accountHolder',
            'holderDocument',
            'bank',
            'agency',
            'account',
            'accountType',
            'email',
            'marital',
            'gender',
            'birthDate',
            'cityOrigin',
            'countryOrigin',
            'complement',
            'emissary',
            'phone',
            'cellphone',
            'emailPrimer',
            'emailDirector',
            'primerCode',
            'unityNumber',
            'area'
        ];

    ObjectUtils.method(Consultant, 'isValid', function () {
        for ( var ix in this) {
            var prop = this[ix];

            if (!_.isFunction(prop)) {
                if (validProperties.indexOf(ix) === -1) {
                    throw 'Unexpected property ' + ix;
                }
            }
        }
    });

    if (arguments.length !== Consultant.length) {
        if (arguments.length === 1 && _.isObject(arguments[0])) {
            Consultant.prototype.isValid.apply(arguments[0]);
            ObjectUtils.dataCopy(this, arguments[0]);
        } else {
            throw 'Consultant must be initialized with uuid, name, mkCode, cep, address, cpf, bank, agency, account, email';
        }
    } else {
        this.uuid = uuid;
        this.name = name;
        this.mkCode = mkCode;
        this.cep = cep;
        this.address = address;
        this.cpf = cpf;
        this.bank = bank;
        this.agency = agency;
        this.account = account;
        this.email = email;
    }
    ObjectUtils.ro(this, 'uuid', this.uuid);
};

module.exports = Consultant;