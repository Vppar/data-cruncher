'use strict';

var uuid = require('node-uuid');

function vpinkUUID(deviceId, op, id) {
  if (op > 0xff || id > 0xffff) {
    throw 'uuid seed data too big, op max is 255 and id max is 4095';
  }

  // split the counter bytes
  var high = id >> 8;
  var low = id & 0xff;

  // map our precious 6 bytes
  var seed = [
    deviceId, 0x00, op, 0x00, high, low
  ];

  // generate the uuid
  return uuid.v1({
    node: seed
  });
}

module.exports = vpinkUUID