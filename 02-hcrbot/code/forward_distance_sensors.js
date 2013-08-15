exports.init = function(robot) {
	// Analog distance sensors
	var analogPins = ['A1', 'A2', 'A3', 'A4', 'A5']
	var distanceCollections = {}

	analogPins.forEach(function(pin, idx) {
		var irSensor = new robot.board.Component({
			pins: pin
		})

		irSensor.read(function(data) {
			if (!robot.ready)
				return

			if (!distanceCollections[idx])
				distanceCollections[idx] = []

			distanceCollections[idx].push(data)
		})
	})

	// Take the median distance every interval
	var distancePollTime = 250
	function ascNumberSort(a, b){ return (a-b); }
	function sensorSort(a, b){ return (a.inches-b.inches); }

	setInterval(function() {
		var dangerPositions = []

		for (var idx in distanceCollections) {
			var medianIdx = Math.floor(distanceCollections[idx].length/2)
			var distance = distanceCollections[idx].sort(ascNumberSort)[medianIdx]

			var inches = 4192.936 * Math.pow(distance, -0.935) - 3.937
			if (inches < 15)
				dangerPositions.push({
					idx: idx,
					inches: inches
				})

			distanceCollections[idx] = []
		}

		if (dangerPositions.length) {
			var cautionSensor = dangerPositions.sort(sensorSort)[0]
			console.log('Act on caution sensor: ', cautionSensor)
			robot.handleIRSensor(cautionSensor)
		}

	}, distancePollTime)
}