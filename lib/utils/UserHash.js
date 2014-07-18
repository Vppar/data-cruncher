var crypto = require('crypto');

var d = crypto.createHash('sha256').update('wesleyakio@tuntscorp.com').digest('hex');

console.log(d);