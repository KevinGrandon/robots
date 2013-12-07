var Sparky = require('sparky')
var config = require('./config')

var sparky = new Sparky({
	deviceId: config.DEVICE_ID,
	token: config.ACCESS_TOKEN,
})

var val = 0;
(function toggle() {
	val = 1 - val;
	sparky.digitalWrite('D7', val);
	setTimeout(toggle, 2000);
})();

// Toggle servo
/*
var val = 0;
(function toggle() {
	val = 180 - val;
	sparky.analogWrite('A1', val);
	setTimeout(toggle, 3000);
})();
*/
