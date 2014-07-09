'use strict';

var _ = require('underscore');
var ObjectUtils = require('./ObjectUtils.js');
var Consultant = require('./../entities/Consultant.js');

function ConsultantInterface (journalKeeper) {

    this.journalKeeper = journalKeeper;
    var currentEventVersion = 1;

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
}

module.exports = ConsultantInterface;

