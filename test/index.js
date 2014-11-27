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
		var diffCode = 'a different code';

		testBomb.once('exploded', function (code, duration, reason) {
			assert.strictEqual(code, diffCode);
			assert.strictEqual(testBomb.code, testCode);
			assert(duration < 100);
			assert.strictEqual(reason, 'wrongCode');

			done();
		});

		testBomb.arm(testCode);
		testBomb.disarm(diffCode);
	});

	it('explodes if already armed', function (done) {
		var testBomb = new Bomb();
		var testCode = 'the right code';
		var diffCode = 'a different code';

		testBomb.once('exploded', function (code, duration, reason) {
			assert.strictEqual(code, diffCode);
			assert.strictEqual(testBomb.code, testCode);
			assert(duration < 100);
			assert.strictEqual(reason, 'alreadyArmed');

			done();
		});

		testBomb.arm(testCode);
		testBomb.arm(diffCode);
	});

	it('emits disarm with the correct duration', function (done) {
		var testBomb = new Bomb();
		var testCode = 'the right code';

		testBomb.once('disarmed', function (code, duration) {
			assert.strictEqual(code, testCode);
			assert(duration >= 50);

			done();
		});

		testBomb.arm(testCode);

		setTimeout(function () {
			testBomb.disarm(testCode);
		}, 50);
	});

	it('the bomb does not timeOut after it has been disarmed', function (done) {
		var testBomb = new Bomb();
		var testCode = 'the right code';

		testBomb.on('exploded', function () {
			throw new Error('disarmed bomb exploded');
		});

		testBomb.arm(testCode, 10);
		testBomb.disarm(testCode);

		setTimeout(function () {
			done();
		}, 50);
	});

	it('the bomb does not timeOut after it has exploded once', function (done) {
		var testBomb = new Bomb();
		var testCode = 'the right code';

		var count = 0;

		testBomb.on('exploded', function () {
			count += 1;
		});

		testBomb.arm(testCode, 10);

		setTimeout(function () {
			assert.strictEqual(count, 1);
			done();
		}, 50);
	});

	it('cannot arm a bomb with no code', function (done) {
		var testBomb = new Bomb();

		assert.throws(function () {
			testBomb.arm();
		});

		done();
	});

	it('cannot disarm a bomb with no code', function (done) {
		var testBomb = new Bomb();

		assert.throws(function () {
			testBomb.arm();
		});

		done();
	});
});
