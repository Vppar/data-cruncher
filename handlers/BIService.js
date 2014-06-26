_ = require('underscore');
_.mixin(require('underscore.deep'));

function BIService(biRef, intervals) {

    var goal = 0;

    for (var target in intervals) {
        if(intervals[target].goal){
            goal += intervals[target].goal;
        }
    };

    this.goal = goal.toFixed(2);

    this.summary = [];

    this.intervals = intervals;

    this.append = function (order) {

        var date;

        if (order.date instanceof Date) {
            date = order.date.toISOString().split('T')[0];
        } else {
            date = order.date.split('T')[0];
        }

        var sum = 0;

        for (var ix in order.items) {
            var qty = order.items[ix].qty;
            var points = order.items[ix].points;

            sum += qty * points;
        }

        if (!this.summary[date]) {
            this.summary[date] = 0;
        }

        if (!isNaN(sum)) {
            this.summary[date] += sum;
        }
    }

    this.charts = function () {

        var gauge = {
            "snapshot": 0,
            "goal": this.goal,
            "percent": "0%"
        };

        var termometer = {
            "snapshot": 0,
            "goal": this.goal,
            "percent": "0%"
        };

        var intervals = {};

        _.extend(intervals, this.intervals);

        var cumulative = {
            bands: []
        }

        var histogram = {
            bands: []
        }

        for (var ix in this.summary) {

            // gauge
            gauge.snapshot += this.summary[ix];
            gauge.percent = Math.round(gauge.snapshot / gauge.goal * 100) + "%";
        }

        var goal = 0, snapshot = 0;

        for (var i in intervals) {
            var interval = intervals[i];


            for (var j in this.summary) {
                if (this.checkInterval(i, j)) {
                    interval.snapshot += this.summary[j]
                }
            }

            histogram.bands.push(_.deepClone(interval));

            goal += interval.goal;
            snapshot += interval.snapshot;
            interval.goal = Math.round(goal);
            interval.snapshot = snapshot;

            cumulative.bands.push(interval);

        }

        termometer.snapshot = Math.round(snapshot);
        termometer.goal = Math.round(goal);
        termometer.percent = Math.round(termometer.snapshot / termometer.goal * 100) + "%";

        gauge.snapshot = Math.round(snapshot);
        gauge.goal = Math.round(goal);
        gauge.percent = Math.round(gauge.snapshot / gauge.goal * 100) + "%";

        var already = false;
        for (var i = histogram.bands.length - 1; i >= 0; i--) {
            if (histogram.bands[i].snapshot === 0 && i !== 0 ) {
                delete histogram.bands[i].snapshot;
                delete cumulative.bands[i].snapshot;
            } else {
                histogram.current = i;
                cumulative.current = i;
                termometer.snapshot = cumulative.bands[i].snapshot;
                termometer.goal = cumulative.bands[i].goal;
                termometer.percent = Math.round(termometer.snapshot / termometer.goal * 100) + "%"
                break;
            }
        }

        if (biRef) {
            biRef.set({gauge: gauge, cumulative: cumulative, histogram: histogram, termometer: termometer});
        }
    }

    this.checkInterval = function (start, date) {

        var s = setTime(new Date(start), 0, 0, 0, 0);
        var e = setTime(new Date(s.getTime() + 1000 * 60 * 60 * 24 * 7), 0, 0, 0, 0);
        var d = new Date(date);

        return (s < d && d < e);
    }

    function setTime(date, hours, minutes, seconds, milliseconds) {
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(seconds);
        date.setMilliseconds(milliseconds);
        return date;
    }
}

module.exports = BIService;