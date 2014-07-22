'use strict';

var ObjectUtils = require('../handlers/ObjectUtils.js');
var Type = require('./Type.js');
var MasterKeeper = require('../keepers/MasterKeeper.js');

function TypeInterface(journalKeeper) {

  var currentEventVersion = 1;

  ObjectUtils.superInvoke(this, journalKeeper, 'Type', Type, currentEventVersion);

  this.add = function (type) {

    if (!(type instanceof Type)) {
      throw Error('Wrong instance to TypeKeeper');
    }

    // save the journal entry
    return this.journalize(type);
  };
}

ObjectUtils.inherit(TypeInterface, MasterKeeper);

module.exports = TypeInterface;