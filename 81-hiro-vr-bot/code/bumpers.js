var _ = require('underscore')

exports.init = function(robot) {

	// Bumpers
	var bumperPins = [
		{
			pos: 'right',
			pin:8
		}, 
		{
			pos: 'center',
			pin: 9,
		},
		{
			pos: 'left',
			pin: 10
		}
	]

	// Wait for robot initialization to start reading
	bumperPins.forEach(function(def) {
		var isDown = false

		var bumpers = new robot.board.Component({
			pins: def.pin
		})

		bumpers.read(_.debounce(function(data) {
			if (data == 0) {
				// Set direction
				console.log('Hit detected on ', def.pos, ' bumper.')
				isDown = true
				robot.handleBumper(def, true)
			} else if (data == 1 && isDown === true) {
				// The button is up.
				isDown = false
				robot.handleBumper(def, false)
			}
		}, 300 /* Immediate edge of debounce */))
	})
}
