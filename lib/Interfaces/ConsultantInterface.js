'use strict';

var _ = require('underscore');
var ObjectUtils = require('./../entities/ObjectUtils.js');
var Consultant = require('./../entities/Consultant.js');
var MasterKeeper = require('./../keepers/MasterKeeper.js');

function ConsultantInterface () {

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

ObjectUtils.inherit(ConsultantInterface, MasterKeeper);

module.exports = ConsultantInterface;

