'use strict';

var request = require('request');
var MarketsService = require('../services/MarketsService');

function CurrencyController(options) {
  this.node = options.node;
  this.marketsService = new MarketsService({node: this.node});
}

CurrencyController.prototype.index = function(req, res) {

    this.marketsService.getInfo(function (err, info) {
      res.jsonp({
        status: 200,
        data: { 
          bitstamp: info.price_usd
        }
      });
    });

};

module.exports = CurrencyController;
