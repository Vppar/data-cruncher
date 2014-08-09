var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');
var JournalKeeper = require('../../../lib/keepers/JournalKeeper.js');

var checkModule = requireHelper('check');

var Check = checkModule.Entity;
var CheckHandler = checkModule.Handler;
var CheckInterface = checkModule.Interface;

describe('Check Interface', function () {

  it('should create an instance of CheckInterface object', function (done) {
    var journalKeeper = new JournalKeeper();
    var checkHandler = new CheckHandler();
    expect(new CheckInterface(journalKeeper, checkHandler)).to.be.instanceof(CheckInterface);
    done();
  });

  it('should add a Check', function (done) {
    var journalKeeper = new JournalKeeper();
    var checkHandler = new CheckHandler();
    var checkInterface = new CheckInterface(journalKeeper, checkHandler);

    var result = checkInterface.add(new Check({}));

    expect(result).to.be.an('object');
    done();
  });

  it('should fail add a Check', function (done) {
    var journalKeeper = new JournalKeeper();
    var checkHandler = new CheckHandler();
    var checkInterface = new CheckInterface(journalKeeper, checkHandler);

    var result = checkInterface.add({});

    expect(result).to.eventually.be.rejected.notify(done);
  });
});