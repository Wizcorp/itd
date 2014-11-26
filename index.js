var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

var DEFAULT_DURATION = 90 * 1000;

function Bomb() {
	EventEmitter.call(this);
}

inherits(Bomb, EventEmitter);

Bomb.prototype.arm = function (code, duration) {
	var that = this;
	var start = Date.now();

	function explode(reason) {
		that.emit('exploded', code, Date.now() - start, reason);
	}

	if (this.fuse) {
		return explode('alreadyArmed');
	}

	duration = duration || DEFAULT_DURATION;

	this.fuse = setTimeout(function () {
		explode('timeOut');
	}, duration);

	this.disarm = function (disarmCode) {
		if (disarmCode !== code) {
			return explode('wrongCode');
		}

		clearTimeout(this.fuse);
		this.fuse = null;

		this.emit('disarmed', code, Date.now() - this.start);
	};
};

module.exports = Bomb;
