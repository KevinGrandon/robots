var ds = require('dualshock-controller')()

ds.on('battery:change', function (value) {
	console.log('battery:change battery', value)
});

ds.on('connection:change', function (value) {
	console.log('connection:change battery', value)
});

ds.on('charging:change', function (value) {
	console.log('connection:change battery', value)
});


ds.on('connected', function(data) {
	console.log('ds connected');
})

ds.on('error', function (data) {
	console.log(data)
})

console.log('connecting.')
ds.connect()