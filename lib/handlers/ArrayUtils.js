'use strict';

var _ = require('underscore');

/**
 * Presents some useful functions to handle arrays
 *
 * all methods must be called with arrays of objects
 *
 * @constructor
 */
function ArrayUtils() {

    /**
     *
     * <pre>
     *
     * @unit ArrayUtils.list#1
     * -> array of objects
     * -> property containing a property
     * -> value of the property
     * <- array with the occurrences
     *
     *  @unit ArrayUtils.list#2
     * -> an invalid array
     * -> property containing a property
     * -> value of the property
     * <- empty array
     *
     *  @unit ArrayUtils.list#3
     * -> array of objects
     * -> property
     * -> value of the property
     * <- empty array
     *
     *  @unit ArrayUtils.list#4
     * -> array of objects
     * -> property containing an invalid property
     * -> value of the property
     * <- empty array
     *
     *  @unit ArrayUtils.list#5
     * -> array of objects containing numbers
     * -> valid property
     * -> value of the property
     * <- array with the occurrences
     *
     *  @unit ArrayUtils.list#6
     * -> array of objects containing arrays
     * -> valid property
     * -> value of the property
     * <- array with the occurrences
     *
     *  @unit ArrayUtils.list#7
     * -> array of objects containing objects
     * -> valid property
     * -> value of the property
     * <- array with the occurrences
     *
     * </pre>
     *
     * TODO - description
     *
     * @param {Array} array - the array to be searched(must be an array of objects)
     * @param {String} property - the property we are looking for
     * @param {Object} value - the value the property must have to be included in the
     *            filter
     *
     * @return []
     */
    this.list = function (array, property, value) {

        var response = [];

        for (var idx in array) {
            var item = array[idx];

            if (!_.isObject(item)) {
                continue;
            }

            if (item[property] === value) {
                response.push(item);
            }
        }
        return response;
    };

    /**
     * <pre>
     * @unit ArrayUtils.find#1
     * -> array of objects without duplicated entries
     * -> property containing a valid property
     * -> value of the property
     * <- object ocurrence
     *
     * @unit ArrayUtils.find#2
     * -> array of objects with array
     * -> property containing a valid property
     * -> value of the property
     * <- object ocurrence
     *
     * @unit ArrayUtils.find#3
     * -> array of objects with numbers
     * -> property containing a valid property
     * -> value of the property
     * <- object ocurrence
     *
     * @unit ArrayUtils.find#4
     * -> array of objects with objects
     * -> property containing a valid property
     * -> value of the property
     * <- object ocurrence
     *
     * @unit ArrayUtils.find#5
     * -> an invalid array
     * -> property containing a valid property
     * -> value of the property
     * <- null
     *
     * @unit ArrayUtils.find#6
     * -> array of objects
     * -> property containing an invalid property
     * -> value of the property
     * <- null
     *
     * @unit ArrayUtils.find#7
     * -> array with duplicate entries
     * -> property containing a valid property
     * -> value of the property
     * <- throw error
     * </pre>
     */
    this.find = function (array, property, value) {

        var response = this.list(array, property, value);

        if (response.length === 1) {
            response = response[0];
        } else if (response.length === 0) {
            response = null;
        } else {
            throw 'find returned ' + response.length + ' results, a maximum of one expected';
        }

        return response;
    };

    /**
     * <pre>
     * @unit ArrayUtils.distinct#1
     * -> array of objects
     * -> property containing an array
     * <- array with the occurrences
     *
     * @unit ArrayUtils.distinct#2
     * -> array of objects
     * -> property containing an objects
     * <- array with the occurrences
     *
     * @unit ArrayUtils.distinct#3
     * -> array of objects
     * -> property containing a string
     * <- array with the occurrences
     *
     * @unit ArrayUtils.distinct#4
     * -> array of objects
     * -> property containing a number
     * <- array with the occurrences must be returned
     *
     * @unit ArrayUtils.distinct#5
     * -> array of objects
     * -> property which the value is an array
     * <- the array of the given property
     *
     * @unit ArrayUtils.distinct#6
     * -> array of objects
     * -> non existing property
     * <- array with a single undefined element
     *
     * TODO - not sure what it should be o.O
     * @unit ArrayUtils.distinct#7
     * -> invalid array
     * -> ?
     * <- empty array
     *
     * </pre>
     *
     * Return a deduplicated list of values for the given property
     *
     * @param array - the array to be searched
     * @param property - the property we are looking for
     *
     * @return []
     */
    this.distinct = function (array, property) {

        var response = [];

        for (var idx in array) {

            var item = array[idx];

            if (!_.isObject(item)) {
                continue;
            }

            if (response.indexOf(item[property]) === -1) {
                response.push(item[property]);
            }
        }
        return response;
    };

    /**
     * <pre>
     * @unit ArrayUtils.filter#1
     * -> array of objects
     * -> a filter with properties containing strings, numbers, arrays and objects)
     * <- an array with the matching elements
     *
     * @unit ArrayUtils.filter#2
     * -> array of objects
     * -> non matching filter
     * <- empty array
     *
     * @unit ArrayUtils.filter#4
     * -> invalid array
     * -> ?
     * <- empty array
     *
     * </pre>
     *
     * Return a list of values that match the given filter
     * TODO make it work properly on filters with properties containing arrays or objects
     *
     * @param array - the array to be searched
     * @param filter - An Object in which the keys are property names and
     *            the values are the expected values
     *
     * @return []
     */
    this.filter = function (array, filter) {

        var response = array;

        for (var keyName in filter) {
            response = this.list(response, keyName, filter[keyName]);
        }

        return response;
    };

    /**
     * <pre>
     * @unit ArrayUtils.isIn#1
     * -> array of objects
     * -> existing property
     * -> list of strings
     * <- an array with the matching elements
     *
     * @unit ArrayUtils.isIn#2
     * -> array of objects
     * -> existing property
     * -> list of numbers
     * <- an array with the matching elements
     *
     * @unit ArrayUtils.isIn#3
     * -> array of objects
     * -> existing property
     * -> list of arrays
     * <- an array with the matching elements
     *
     * @unit ArrayUtils.isIn#4
     * -> array of objects
     * -> existing property
     * -> list of objects
     * <- an array with the matching elements
     *
     * @unit ArrayUtils.isIn#5
     * -> invalid array
     * -> ?
     * -> ?
     * <- empty array
     *
     * @unit ArrayUtils.isIn#6
     * -> array of objects
     * -> non existent property
     * -> ?
     * <- empty array
     *
     * @unit ArrayUtils.isIn#7
     * -> array of objects
     * -> existing property
     * -> string
     * <- empty array
     *
     * </pre>
     *
     *
     * TODO Succinctly describe this methods behavior
     *
     * @param array - the array to be searched
     * @param property - the property in which we will be searching
     * @param ids - the values we will be searching for in that property
     *
     * @return []
     */
    this.isIn = function (array, property, ids) {

        var response = [];

        for (var idx in array) {
            var item = array[idx];

            if (!_.isObject(item)) {
                continue;
            }

            if (ids.indexOf(item[property]) !== -1) {
                response.push(item);
            }
        }
        return response;
    };

    /**
     * <pre>
     * @unit ArrayUtils.innerJoin#1
     * -> array of objects
     * -> array of objects
     * -> property containing string
     * <- an array of joined objects
     *
     * @unit ArrayUtils.innerJoin#2
     * -> array of objects
     * -> array of objects
     * -> property containing number
     * <- an array of joined objects
     *
     * @unit ArrayUtils.innerJoin#3
     * -> array of objects
     * -> array of objects
     * -> property containing object
     * <- an array of joined objects
     *
     * @unit ArrayUtils.innerJoin#4
     * -> array of objects
     * -> array of objects
     * -> property containing array
     * <- an array of joined objects
     *
     * @unit ArrayUtils.innerJoin#5
     * -> array of objects
     * -> array of objects
     * -> property existing only in a1
     * <- an empty array
     *
     * @unit ArrayUtils.innerJoin#6
     * -> array of objects
     * -> array of objects
     * -> property existing only in a2
     * <- an empty array
     *
     * @unit ArrayUtils.innerJoin#7
     * -> array of objects
     * -> array of objects
     * -> non existent property
     * <- an empty array
     *
     * @unit ArrayUtils.innerJoin#8
     * -> invalid array
     * -> ?
     * -> ?
     * <- an empty array
     *
     * @unit ArrayUtils.innerJoin#9
     * -> array of objects
     * -> invalid array
     * -> ?
     * <- an empty array
     *
     * </pre>
     *
     *
     * TODO Joins two arrays on a matching property
     *
     * @param a1 - the first array of the join
     * @param a2 - the second array of the join
     * @param on - the property to join in
     *
     * @return []
     */
    this.innerJoin = function (a1, a2, on1, on2) {

        var a1f = [];
        var a2f = [];

        on2 = on2 ? on2 : on1;

        // TODO no need to initialize, but jshint keeps complaining :/
        var idx1 = 0, idx2 = 0;

        for (idx1 in a1) {
            if (_.isObject(a1[idx1]) && a1[idx1][on1] !== undefined) {
                a1f.push(a1[idx1]);
            }
        }

        for (idx2 in a2) {
            if (_.isObject(a2[idx2]) && a2[idx2][on2] !== undefined) {
                a2f.push(a2[idx2]);
            }
        }

        var response = [];

        for (idx1 in a1f) {
            var item1 = a1f[idx1];

            for (idx2 in a2f) {
                var item2 = a2f[idx2];

                if (item1[on1] === item2[on2]) {
                    var obj = {};
                    _.extend(obj, item1, item2);
                    response.push(obj);
                }
            }
        }
        return response;
    };
}

module.exports = new ArrayUtils();
