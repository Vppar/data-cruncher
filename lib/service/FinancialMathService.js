'use strict';

/**
 * Utility service to financial mathematics.
 *
 * @author Arnaldo S. Rodrigues Jr.
 */

var MisplacedService = require('./../service/MisplacedService.js');

function FinancialMathService() {

    this.financialRound = function financialRound(value) {
        return (Math.round(100 * value) / 100);
    };

    this.currencySum = function currencySum(value1, value2) {
        return this.financialRound(Number(value1) + Number(value2));
    };

    this.currencySubtract = function currencySubtract(value1, value2) {
        return this.financialRound(Number(value1) - Number(value2));
    };

    this.currencyMultiply = function currencyMultiply(value1, value2) {
        return this.financialRound(Number(value1) * Number(value2));
    };

    this.currencyDivide = function currencyDivide(value1, value2) {
        var result = 0;
        if (value2 !== 0) {
            result = this.financialRound(Number(value1) / Number(value2));
        }
        return result;
    };

    this.round = function (number, places) {
        places = places ? places : 2;
        var zeroes = Math.pow(10, places);
        return Math.round(number * zeroes) / zeroes;
    };

    this.floor = function (number, places) {
        places = places ? places : 2;
        var zeroes = Math.pow(10, places);
        return Math.floor(number * zeroes) / zeroes;
    };

    this.presentValue = function (fixedRatio, monthlyRatio, numberOfInstallments, amount) {
        var installments = [];
        for (var ix = 0; ix < numberOfInstallments; ix++) {
            installments.push({index: ix, amount: 0});
        }
        MisplacedService.recalc(amount, -1, installments, 'amount');
        var result = 0;
        for (var ij in installments) {
            var installment = installments[ij];
            var equivalentRatio = this.equivalentRatio(installment.index, fixedRatio, monthlyRatio);
            var installmentPresentValue = this.currencyDivide(installment.amount, equivalentRatio);

            result = this.currencySum(result, installmentPresentValue);
        }
        //result = this.currencySubtract(amount, result);
        return result;
    };

    this.equivalentRatio = function (installment, fixedRatio, monthlyRatio) {
        var roundedFixedRatio = this.round(fixedRatio / 100, 4);
        var roundedMonthlyRatio = 1 + this.round(monthlyRatio / 100, 4);
        var ratio = roundedFixedRatio + this.round(Math.pow(roundedMonthlyRatio, installment + 1), 6);
        return ratio;
    };
}

module.exports = new FinancialMathService();