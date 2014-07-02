var _ = require('underscore');
var ObjectUtils = require('./../handlers/ObjectUtils.js');

function Grid(id, grid) {

    if (arguments.length !== Grid.length) {
        throw 'Grid must be initialized with an id and a grid(array of ids)';
    }

    if (!grid instanceof Array) {
        throw 'Grid must be an array';
    }

    ObjectUtils.ro(this, 'id', id);
    ObjectUtils.ro(this, 'grid', grid);
};

module.exports = Grid;