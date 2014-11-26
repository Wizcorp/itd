#itd


## Improvised Timeout Device

Timed locks with a fun, bomb-style interface.

## Methods

### `arm( code, [duration] )`
Arm your bomb with a `code` that is required to `disarm` it. `duration` is an optional argument that tells your bomb how long (in milliseconds) to wait before exploding. The default duration is 90 seconds. Attempting to arm the bomb without disarming it first will cause it to explode.

### `disarm( code )`
The only way to stop your bomb from exploding is to `disarm` it using the `code` it was armed with. If you try to disarm it using a different code, it will explode.

## Events

### `exploded` ( code, duration, reason )

Emitted when the bomb explodes. There are three reasons for why a bomb will explode:
* `timeOut`: `duration` milliseconds elapsed after calling `arm` without `disarm` being called.
* `alreadyArmed`: `disarm` was not called before `arm` was called.
* `wrongCode`: `disarm` was called with a different code than when `arm` was called.

### `disarmed` ( code, duration )

Emitted when the bomb is disarmed. `duration` is how long the bomb was armed.

## Sample Usage

``` javascript
var Bomb = require('itd');

var testBomb = new Bomb();

function fail(msg) {
	console.error(msg);
	process.exit(1);
}

testBomb.on('exploded', function (code, duration, reason) {
	if (reason === 'timeOut') {
		return fail('Step:' + code + 'failed to complete in' + duration + 'msec');
	}

	return fail('Step: ' + code + ' was completed out of order');
});

testBomb.on('disarmed', function (name, duration) {
	console.log('Step:', name, 'completed in', duration, 'msec');
});

async.forEach(testList, function (testId, callback) {
	testBomb.arm(testId);
	tests[testId](function () {
		testBomb.disarm(testId);
		callback.apply(null, arguments);
	});
}, function (error) {
	if (error) {
		return fail(error);
	}

	process.exit(0);
});

```
