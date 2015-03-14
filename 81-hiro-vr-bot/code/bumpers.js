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
		var bumpers = new robot.board.Component({
			pins: def.pin
		})

		bumpers.read(function(data) {
			if (data == 0) {
				// Set direction
				console.log('Hit detected on ', def.pos, ' bumper.')
				robot.handleBumper(def)
			}
		})
	})
}
