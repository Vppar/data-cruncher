'use strict';

var ObjectUtils = require('./ObjectUtils.js');
var Target = require('./../entities/Target.js');
var ArrayUtils = require('./ArrayUtils.js');

function TargetHandler() {
    var targets = [];
    this.handlers = {};
    this.targets = targets;

    /**
     * Create the final target object and push it to the DataBase
     *
     * @param {event} - Object containing the nescessary data to create the target.
     */
    ObjectUtils.ro(this.handlers, 'targetAddV1', function (event) {
        event = new Target(event);
        targets.push(event);

        return event.uuid;
    });

    /**
     * Updates target object.
     *
     * @param {event} - Object to be updated.
     */
    ObjectUtils.ro(this.handlers, 'targetUpdateV1', function (event) {
        var oldTarget = ArrayUtils.find(targets, 'uuid', event.uuid);

        targets[targets.indexOf(oldTarget)] = event;

        return event.uuid;
    });

    //##########################################################################################################################
    //Utils
    //##########################################################################################################################

//    /**
//     * gets a date and formats to a string on yyyy-MM-dd format
//     *
//     * @param date
//     * @returns {string}
//     */
//
//    function dateFormatter(date) {
//        date = new Date(date);
//        var yyyy = date.getFullYear().toString();
//        var mm = (date.getMonth() + 1).toString();
//        var dd = date.getDate().toString();
//        return yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]);
//    }
//
//    /**
//     * Getas a target obj and return a obj array, with the compatible format for the bi.
//     *
//     *
//     * @param target
//     * @returns {Array}
//     */
//
//    this.translator = function(target) {
//        var intervals = [];
//
//        for (var ix in target) {
//            var date = target[ix].initial;
//
//            date = dateFormatter(date);
//
//            intervals[date] = {
//                order: Number(ix) + Number(1),
//                goal: target[ix].splitAmount,
//                snapshot: 0,
//                label: 'sem ' + (Number(ix) + Number(1))
//            };
//        }
//
//        return intervals;
//    };
}

module.exports = TargetHandler;