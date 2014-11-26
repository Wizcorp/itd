var assert = require('assert');

var Bomb = require('../');

describe('explodes', function () {
	it('explodes after 50 milliseconds', function (done) {
		var testBomb = new Bomb();
		var testCode = '50 milliseconds';

		testBomb.once('exploded', function (code, duration, reason) {
			assert.strictEqual(code, testCode);
			assert(duration >= 50);
			assert.strictEqual(reason, 'timeOut');

			done();
		});

		testBomb.arm(testCode, 50);
	});

	it('explodes if given the wrong code', function (done) {
		var testBomb = new Bomb();
		var testCode = 'the right code';

		testBomb.once('exploded', function (code, duration, reason) {
			assert.strictEqual(code, testCode);
			assert(duration < 100);
			assert.strictEqual(reason, 'wrongCode');

			done();
		});

		testBomb.arm(testCode);
		testBomb.disarm('the wrong code');
	});

	it('explodes if already armed', function (done) {
		var testBomb = new Bomb();
		var testCode = 'the right code';

		testBomb.once('exploded', function (code, duration, reason) {
			assert.strictEqual(code, testCode);
			assert(duration < 100);
			assert.strictEqual(reason, 'alreadyArmed');

			done();
		});

		testBomb.arm(testCode);
		testBomb.arm(testCode);
	});
});
