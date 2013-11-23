var ds = require('dualshock-controller')();

ds.on('left:move', function(data) {
	console.log('left Moved');
	console.log(data);
});

ds.on('right:move', function(data) {
	console.log('right Moved');
	console.log(data);
});

ds.on('connected', function(data) {
	console.log('connected');
});

ds.on('error', function (data) {
	console.log(data);
});

var pressed = function (data) {
	console.log(data + ": pressed");
};

var released = function (data) {
	console.log(data + ": released");
};

var analog = function (data) {
    //console.log(data + ": analog");
};

var buttons = ['l2', 'r2', 'l1', 'r1', 'triangle', 'circle', 'x', 'square', 'select', 'start', 'leftAnalogBump', 'rightAnalogBump', 'dpadUp', 'dpadRight', 'dpadDown', 'dpadLeft', 'psxButton'];
buttons.forEach(function(button) {
	this.controller.on(button + ":pressed", pressed);
	this.controller.on(button + ":release", released);
})

ds.connect();
