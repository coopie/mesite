var fs = require('fs');

var logFile = fs.createWriteStream('./usage.log', {flags: 'a'}); // use {flags: 'w'} to open in write mode

// This gives a really simple way for me to track usage of my site.

function BlogLogger() {
    this.tally = {};

    setInterval(function() {
        fs.appendFile('./usage.log', this.getUsageData());
    }.bind(this),  1000 * 60 * 60 * 24);
}

BlogLogger.prototype.tick = function(page) {
    this.tally[page] = this.tally[page] ? this.tally[page] + 1 : 1;
};

BlogLogger.prototype.getUsageData = function() {
    return new Date().toString() + '\n' +
        JSON.stringify(this.tally, undefined, 4) + '\n';
};

module.exports = BlogLogger;
