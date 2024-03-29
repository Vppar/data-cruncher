'use strict';

var _ = require('underscore');
var q = require('q');

function JournalKeeper(journalRef) {

  var that = this;

  that.nextId = 1;

  this.updateNextId = function(existingId){
    if(_.isNumber(existingId) && existingId >= this.nextId){
      that.nextId = existingId + 1;
    }
  };

  this.compose = function (entry) {

    entry.sequence = that.nextId++;

    var deferred = q.defer();

    if (journalRef) {
      journalRef.child(entry.sequence).transaction(function (currentValue) {
        if (currentValue === null) {
          entry.synced = new Date().getTime();

          return {
            '.value': entry,
            '.priority': entry.sequence
          };
        }
      }, function (error, committed) {
        if (committed) {
          // Entry stored
          deferred.resolve();
        } else if (error) {
          // Failed to store entry
          deferred.reject(error);
        } else {
          // Entry already exists
          var message = 'Duplicate entry sequence!';
          deferred.reject(message);
        }
      });
    }

    return deferred.promise;
  };
}

module.exports = JournalKeeper;