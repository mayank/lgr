var 
	FS				= require('fs'),
	_ 				= require('lodash'),
	MOMENT 			= require('moment');


function LGR() {

	this.count = 0;
    this.setLogFormat('<%= ts %> [<%= uptime %>] [<%= count %>] ');

	this.outStream = FS.createWriteStream('default.access.log');
	this.errStream = FS.createWriteStream('default.error.log');
}

LGR.prototype.setOut = function(fileName) {
	if(typeof fileName == 'string') this.outStream = FS.createWriteStream(fileName);
}

LGR.prototype.setErr = function(fileName) {
	if(typeof fileName == 'string') this.errStream = FS.createWriteStream(fileName);
}

LGR.prototype.critical = function() {
	this.count++;
	this.errStream.write('CRITICAL! ' + this._p() + Object.values(arguments).join(" ") + "\n");
}

LGR.prototype.error = function() {
	this.count++;
	this.errStream.write('ERR! ' + this._p() + Object.values(arguments).join(" ") + "\n");
}

LGR.prototype.log = function() {
	this.count++;
	this.outStream.write('info ' + this._p() + Object.values(arguments).join(" ") + "\n");
}

LGR.prototype.info = function() {
	this.count++;
	this.outStream.write('log ' + this._p() + Object.values(arguments).join(" ") + "\n");
}

LGR.prototype.verbose = function() {
	this.count++;
	this.outStream.write('verb ' + this._p() + Object.values(arguments).join(" ") + "\n");
}

LGR.prototype.debug = function() {
	this.count++;
	this.outStream.write('debug ' + this._p() + Object.values(arguments).join(" ") + "\n");
}

LGR.prototype.setLogFormat = function(format) {
	this.format = _.template(format);
}

LGR.prototype.setLevel = function(level) {
	this.level = level;
}

LGR.prototype._p = function(){
    return this.format({
        "ram"       :  JSON.stringify(process.memoryUsage()),
        "ts"        :  MOMENT().format("YYYY-MM-DD HH:mm:ss"),
        "uptime"    : process.uptime(),
        "pid"       : process.pid,
        "count"     : this.count,
    });
};

module.exports = new LGR();