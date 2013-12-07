var Sparky = require('sparky')
var config = require('./config')

var sparky = new Sparky({
	deviceId: config.DEVICE_ID,
	token: config.ACCESS_TOKEN,
})

// Toggle both servos
var val = 0;
(function toggle() {
	val = 180 - val;
	sparky.run('servowrite', 'A0', val);
	sparky.run('servowrite', 'A1', val);
	setTimeout(toggle, 3000);
})();
