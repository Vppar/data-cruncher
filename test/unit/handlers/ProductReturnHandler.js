var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-as-promised"));

var requireHelper = require('../../require-helper');

var ProductReturn = requireHelper('entities/ProductReturn');
var ProductReturnHandler = requireHelper('handlers/ProductReturnHandler');

describe('ProductReturn handler', function () {

    it('should create an instance of ProductReturnHandler object', function (done) {
        expect(new ProductReturnHandler()).to.be.instanceof(ProductReturnHandler);
        done();
    });

    it('should add a ProductReturn', function (done) {
        var productReturnHandler = new ProductReturnHandler();

        productReturnHandler.handlers.productReturnAddV1(new ProductReturn({}));

        expect(productReturnHandler.productsReturned).to.have.length.above(0);
        done();
    });

    it('should add a ProductReturn', function (done) {
        var productReturnHandler = new ProductReturnHandler();

        productReturnHandler.handlers.productReturnAddV1(new ProductReturn({}));
        productReturnHandler.handlers.productReturnAddV1(new ProductReturn({}));
        productReturnHandler.handlers.productReturnAddV1(new ProductReturn({}));

        productReturnHandler.handlers.nukeProductsReturnedV1();

        expect(productReturnHandler.productsReturned.length).to.eql(0);
        done();
    });
});