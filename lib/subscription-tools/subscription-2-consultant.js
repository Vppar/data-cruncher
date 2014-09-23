'use strict';

function removeUndefined(consultant) {
  for (var ix in consultant) {
    if (consultant[ix] === undefined) {
      delete consultant[ix];
    } else if (typeof consultant[ix] === 'object') {
      removeUndefined(consultant[ix]);
    }
  }
}

function getBirthDayByPiece(date, piece) {
  var result;
  if (date) {
    var pieces = date.split('-');
    if (piece === 'day') {
      result = pieces[2];
    } else if (piece === 'month') {
      result = pieces[1];
    } else if (piece === 'year') {
      result = pieces[0];
    }
  }
  return result;
}

function getGender(code) {
  var result;
  if (code === '1') {
    result = 'Masculino';
  } else if (code === '2') {
    result = 'Feminino';
  }
  return result;
}

function subscription2Consultant(userDataAccount) {
  var consultant = {};
  consultant.name = userDataAccount.name;
  consultant.cep = userDataAccount.cep;
  consultant.gender = getGender(userDataAccount.gender);
  consultant.cpf = userDataAccount.document;
  consultant.email = userDataAccount.email;
  consultant.phone = userDataAccount.landline;
  consultant.cellphone = userDataAccount.cellphone;
  consultant.emailPrimer = userDataAccount.emailPrimer;
  consultant.emailDirector = userDataAccount.emailDirector;
  consultant.primerCode = userDataAccount.primerCode;
  consultant.unityNumber = userDataAccount.unityNumber;
  consultant.emissary = userDataAccount.rg;

  //banking
  consultant.bank = userDataAccount.banking.bank;
  consultant.agency = userDataAccount.banking.agency;
  consultant.account = userDataAccount.banking.account;
  consultant.accountHolder = userDataAccount.banking.holderName;
  consultant.holderDocument = userDataAccount.banking.holderDocument;
  consultant.accountType = userDataAccount.banking.accountType;

  //adress fields
  if (userDataAccount.address) {
    consultant.address = {};
    consultant.address.street = userDataAccount.address.street;
    consultant.address.neighborhood = userDataAccount.address.neighborhood;
    consultant.address.state = userDataAccount.address.state;
    consultant.address.city = userDataAccount.address.city;
    consultant.address.number = userDataAccount.address.number;
    consultant.complement = userDataAccount.address.complement;
  }

  //empty fields on firebase
  consultant.mkCode = userDataAccount.mkCode;
  consultant.marital = userDataAccount.marital;
  consultant.countryOrigin = userDataAccount.countryOrigin || 'Brasil';

  if (userDataAccount.birthday) {
    consultant.birthDate = {};
    consultant.birthDate.day = getBirthDayByPiece(userDataAccount.birthday, 'day');
    consultant.birthDate.month = getBirthDayByPiece(userDataAccount.birthday, 'month');
    consultant.birthDate.year = getBirthDayByPiece(userDataAccount.birthday, 'year');
  }
  removeUndefined(consultant);

  return consultant;
}

module.exports = subscription2Consultant;