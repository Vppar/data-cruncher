var crypto = require('crypto');

var d = crypto.createHash('sha256').update('debora.paula@vpink.vc').digest('hex');

console.log(d);