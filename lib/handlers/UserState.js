'use strict';

var OrderHandler = require('./OrderHandler.js');
var TargetHandler = require('./TargetHandler.js');
var SubscriptionHandler = require('./SubscriptionHandler.js');
var BIService = require('./BIService.js');

var JournalKeeper = require('../keepers/JournalKeeper.js');

var _ = require('underscore');

function UserState(userRef){
    var journalRef = userRef.child('journal');

    var orderHandler = new OrderHandler();
    var targetHandler = new TargetHandler();
    var subscriptionHandler = new SubscriptionHandler();
    var journalKeeper = new JournalKeeper(journalRef);
    var handlers = {};

    var timeout = null;

    var refs = {
        journal : userRef.child('journal'),
        bi: userRef.child('bi')
    };

    _.extend(handlers, orderHandler.handlers, targetHandler.handlers, subscriptionHandler.handlers);

    subscriptionHandler.on('add', function(event){
      userRef.root().child('queues').child('pending').child('subscription-consultant-request').push(event);
    });

    refs.journal.on('child_added', function handleJournalEntry(data) {
        var event = data.val();

        journalKeeper.updateNextId(event.sequence);

        var handler = handlers[event.type + 'V' + event.version];

        if (handler) {
            try {
                handler(event.event);

                if(timeout){
                    clearTimeout(timeout);
                    timeout = null;
                }

                timeout = setTimeout(function(){

                    targetHandler.targets.forEach(function(target){

                        //console.log(target);
                        //console.log(targetHandler.translator(target.targets))

                        var biService = new BIService(refs.bi.child(target.uuid), targetHandler.translator(target.targets));

                        orderHandler.orders.forEach(function(entry){
                            biService.append(entry);
                        });

                        biService.charts();
                    });
                    //refs.journal.off('child_added', handleJournalEntry);
                }, 200);
            } catch (e){
                console.log(e);
            }
        } else {
            //console.log('No handler for ' + event.type);
        }
    });
}

module.exports = UserState;