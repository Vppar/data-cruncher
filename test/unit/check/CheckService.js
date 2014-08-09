var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');
var JournalKeeper = require('../../../lib/keepers/JournalKeeper.js');

var checkModule = requireHelper('check');

var Check = checkModule.Entity;
var CheckHandler = checkModule.Handler;
var CheckInterface = checkModule.Interface;
var CheckService = checkModule.Service;

describe('Check Service', function () {

  it('should create an instance of CheckCheckService object', function (done) {
    expect(new CheckService()).to.be.instanceof(CheckService);
    done();
  });

  it('should add a Check', function (done) {
    var checkHandler = new CheckHandler();
    var journalKeeper = new JournalKeeper();
    var checkInteface = new CheckInterface(journalKeeper, checkHandler);
    var checkService = new CheckService(checkInteface);

    var result = checkService.addCheck(new Check(null, 3, 5, 1, 2, new Date(), 123));

    expect(result).to.be.an('object');
    done();
  });

  it('should change a Check state', function (done) {
    var checkHandler = new CheckHandler();
    var journalKeeper = new JournalKeeper();
    var checkInteface = new CheckInterface(journalKeeper, checkHandler);
    var checkService = new CheckService(checkInteface);

    var result = checkService.changeState(321, 2);

    expect(result).to.be.an('object');
    done();
  });
});