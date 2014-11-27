var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

var DEFAULT_DURATION = 90 * 1000;

function Bomb() {
	EventEmitter.call(this);
}

inherits(Bomb, EventEmitter);

Bomb.prototype.arm = function (code, duration) {
	if (!code) {
		throw new Error('You must arm your bomb with a code.');
	}

	var that = this;
	var start = Date.now();

	function explode(reason, code) {
		clearTimeout(that.fuse);
		that.fuse = null;
		code = code || that.code;

		that.emit('exploded', code, Date.now() - start, reason);
	}

	if (this.fuse) {
		return explode('alreadyArmed', code);
	}

	this.code = code;

	duration = duration || DEFAULT_DURATION;

	this.fuse = setTimeout(function () {
		explode('timeOut');
	}, duration);

	this.disarm = function (code) {
		if (!code) {
			throw new Error('You must disarm your bomb with a code.');
		}

		if (code !== that.code) {
			return explode('wrongCode', code);
		}

		clearTimeout(that.fuse);
		that.fuse = null;

		that.emit('disarmed', code, Date.now() - start);
	};
};

module.exports = Bomb;
