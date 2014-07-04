'use strict';

var _ = require('underscore');
var ObjectUtils = require('./ObjectUtils.js');
var ArrayUtils = require('./ArrayUtils.js');
var Consultant = require('./../entities/Consultant.js');

function ConsultantInterface () {

    var currentEventVersion = 1;
    var consultants = [];
    this.consultants = consultants;
    this.handlers = {};

    ObjectUtils.superInvoke(this, 'Consultant', Consultant, currentEventVersion);

    /**
     * create (Consultant)
     */
    this.create =
        function (consultant) {

            if (!(consultant instanceof Consultant)) {
                throw Error('Wrong instance to ConsultantKeeper');
            }

            var consultantObj = _.clone(consultant);

            return this.journalize('Create', consultantObj);
        };

    /**
     * update (consultant)
     */
        // FIXME - include an uuid check here also.
    this.update =
        function (consultant) {

            if (!(consultant instanceof Consultant)) {
                throw Error('Wrong instance to ConsultantKeeper');
            }

            return this.journalize('Update', consultant);
        };

    /**
     * read (consultant)
     */
    this.read = function (uuid) {
        return ArrayUtils.find(this.list(), 'uuid', uuid);
    };

    /**
     * list
     */
    this.list = function () {
        return _.clone(consultants);
    };

    /**
     * get
     */
    this.get = function () {
        return _.clone(consultants[0]);
    };
}

module.exports = ConsultantInterface;

