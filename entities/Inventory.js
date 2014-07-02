var _ = require('underscore');
var ObjectUtils = require('./../handlers/ObjectUtils.js');

function Inventory(id) {

    if (arguments.length !== Inventory.length) {
        throw 'Inventory must be initialized with an id';
    }

    ObjectUtils.ro(this, 'id', id);
};

module.exports = Inventory;