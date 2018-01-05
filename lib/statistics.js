'use strict';

var BigNumber = require('bignumber.js');
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

module.exports = StatisticsController;