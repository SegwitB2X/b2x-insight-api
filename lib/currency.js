'use strict';

var request = require('request');
var Common = require('./common');

function CurrencyController(options) {
  this.node = options.node;
  this.marketsService = options.marketsService;
  this.common = new Common({ log: this.node.log });
}

CurrencyController.prototype.index = function (req, res) {
  var self = this;

  return this.marketsService.getInfo(function (err, info) {

    if (err || info.price_usd === 0) {
      return self.common.handleErrors(err, res);
    }

    return res.jsonp({
      status: 200,
      data: {
        bitstamp: info.price_usd
      }
    });

  });

};

module.exports = CurrencyController;
