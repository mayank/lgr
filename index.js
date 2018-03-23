var 
	FS				= require('fs'),
	_ 				= require('lodash'),
	MOMENT 			= require('moment'),

	DEBUG 			= 0,
	VERBOSE 		= 1,
	INFO 			= 2,
	ERROR 			= 3,
	CRITICAL 		= 4,

	WRITE_FLAGS		= { 'encoding': 'utf8', 'flags': 'a' },

	LEVEL_MAP 		= [
    	'debug', 
    	'verbose', 
    	'info', 
    	'error', 
    	'critical'
    ];

function LGR() {

	this.count = 0;
    this.setLogFormat('<%= ts %> [<%= uptime %>] [<%= count %>] ');

    this.level = INFO;

	try{
		this.outStream = FS.createWriteStream('default.access.log', WRITE_FLAGS);
		this.errStream = FS.createWriteStream('default.error.log', WRITE_FLAGS);
	}catch(err){
		console.log('You don\'t have permission to access current directory from user');
	}
}

LGR.prototype.toStr = function(args) {
	var objects = _.values(args);

	objects.forEach(function(obj, index){
		if(typeof obj == 'object') objects[index] = JSON.stringify(obj);
	});

	return objects;
};

LGR.prototype.setOut = function(fileName) {
	if(typeof fileName == 'string') {
		try{
			this.outStream = FS.createWriteStream(fileName, WRITE_FLAGS);
		}
		catch(err){
			this.outStream = FS.createWriteStream('default.access.log', WRITE_FLAGS);
		}
	}
};

LGR.prototype.setErr = function(fileName) {
	if(typeof fileName == 'string') {
		try{
			this.errStream = FS.createWriteStream(fileName, WRITE_FLAGS);
		}
		catch(err){
			this.errStream = FS.createWriteStream('default.error.log', WRITE_FLAGS);
		}
	}
};


LGR.prototype.critical = function() {
	if(this.level <= CRITICAL){
		this.count++;
		this.errStream.write('CRITICAL! ' + this._p() + this.toStr(arguments).join(" ") + "\n");
	}
};

LGR.prototype.error = function() {
	if(this.level <= ERROR){
		this.count++;
		this.errStream.write('ERR! ' + this._p() + this.toStr(arguments).join(" ") + "\n");
	}
};

LGR.prototype.log = function() {
	this.count++;
	this.outStream.write('info ' + this._p() + this.toStr(arguments).join(" ") + "\n");
};

LGR.prototype.info = function() {
	if(this.level <= INFO){
		this.count++;
		this.outStream.write('log ' + this._p() + this.toStr(arguments).join(" ") + "\n");
	}
};

LGR.prototype.verbose = function() {
	if(this.level <= VERBOSE){
		this.count++;
		this.outStream.write('verb ' + this._p() + this.toStr(arguments).join(" ") + "\n");	
	}
};

LGR.prototype.debug = function() {
	if(this.level <= DEBUG){
		this.count++;
		this.outStream.write('debug ' + this._p() + this.toStr(arguments).join(" ") + "\n");
	}
};

LGR.prototype.setLogFormat = function(format) {
	this.format = _.template(format);
};

LGR.prototype.setLevel = function(level) {
	this.level = _.indexOf(LEVEL_MAP, level);

	if(this.level === -1) this.level = INFO;
};

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
