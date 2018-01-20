'use strict';

var BigNumber = require('bignumber.js');
var async = require('async');
var Common = require('./common');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function StatisticsController(options) {

    this.node = options.node;
    /**
     *
     * @type {Common}
     */
    this.common = new Common({log: this.node.log});

}

util.inherits(StatisticsController, EventEmitter);

StatisticsController.prototype.totalSupply = function(req, res) {

    var height = this.node.services.bitcoind.height,
        changeBlockCount = 210000,
        reward = 50,
        halfs = Math.floor(height / changeBlockCount),
        supply = 0;

    for(var i = 0; i < halfs; i++) {
        supply += reward * changeBlockCount;
        reward /= 2;
    }

    supply += (height % changeBlockCount) * reward;

    if (req.query.format === 'object') {
        return res.jsonp({
            supply: supply.toString()
        });
    }

    return res.status(200).send(supply.toString());

};

StatisticsController.prototype.addressesInfo = function (req, res) {

    var self = this,
        dataFlow = {
            count_active_addresses: 0,
            count_addresses_with_balance: 0,
            average_balance: '0'
        };

    return async.waterfall([function (callback) {
        return self.node.countActiveAddresses(function (err, value) {

            if (err) {
                return callback(err);
            }

            if (value) {
                dataFlow.count_active_addresses = value;
            }

            return callback();

        });
    }, function (callback) {
        return self.node.countAddressesWithBalance(function (err, value) {

            if (err) {
                return callback(err);
            }

            if (value) {
                dataFlow.count_addresses_with_balance = value;
            }

            return callback();

        });
    }, function (callback) {
        return self.node.averageBalance(function (err, value) {

            if (err) {
                return callback(err);
            }

            if (value) {
                dataFlow.average_balance = value.toString();
            }

            return callback();

        });
    }], function (err) {

        if (err) {
            return self.common.handleErrors(err, res);
        }

        res.jsonp(dataFlow);

    });

};

module.exports = StatisticsController;