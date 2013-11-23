var ds = require('dualshock-controller')()
var pinio = new (require('pinio')).Pinio()

pinio.on('ready', function(board) {
	var right = board.pins(12)
    right.mode('SERVO')

	var left = board.pins(13)
    left.mode('SERVO')

    left.write(90)
    right.write(90)

    var minBound = 120
    var maxBound = 135

	ds.on('left:move', function(data) {
		if (data.y < maxBound && data.y > minBound) {
			console.log('Left -> Stop')
			left.write(90)
		} else if (data.y > maxBound) {
			console.log('Left -> Forward')
			left.write(0)
		} else if (data.y < minBound) {
			console.log('Left -> Backward')
			left.write(180)
		}
	})

	ds.on('right:move', function(data) {
		if (data.x < maxBound && data.x > minBound) {
			console.log('Right -> Stop')
			right.write(90)
		} else if (data.x > maxBound) {
			console.log('Right -> Forward')
			right.write(180)
		} else if (data.x < minBound) {
			console.log('Right -> Backward')
			right.write(0)
		}
	})

	ds.on('connected', function(data) {
		console.log('ds connected');
	})

	ds.on('error', function (data) {
		console.log(data)
	})

	ds.connect()
})
