'use strict';

var data = require('../data');

function UserEndpoint() {
}

module.exports = UserEndpoint;

UserEndpoint.prototype.list = function (req, res) {

  var response = [];

  for (var username in data.states) {
    var user = data.states[username].consultant.data;
    if (user) {
      response.push({phone: user.telefone, subscriptionDate: user.stamp, name: user.nomeConsultora, product: user.nomeProduto, email: user.email});
    }
  }
  res.json(200, response);
};

UserEndpoint.prototype.update = function () {
};

UserEndpoint.prototype.get = function () {
};
