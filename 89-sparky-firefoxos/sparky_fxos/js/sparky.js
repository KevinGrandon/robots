(function() {
	var indicatorSize = 40
	var deviceHeight = window.innerHeight - indicatorSize
	var deviceWidth = window.innerWidth - indicatorSize

	var indicator = document.getElementById('indicator')
	var lastX = 0
	var lastY = 0

	window.addEventListener('devicemotion', function (e) {
		var x = e.accelerationIncludingGravity.x
		var y = e.accelerationIncludingGravity.y
		var max = 6

		// Do not update display for tiny changes, it's too jittery
		if (Math.abs(lastX - x) + Math.abs(lastY - y) < 0.5 ) return

		lastX = x
		lastY = y

		if (x > max) x = max
		if (x < 0 - max) x = 0 - max
		if (y > max) y = max
		if (y < 0 - max) y = 0 - max

		var posX = (x + max) * (deviceWidth / (max * 2))
		var posY = (y + max) * (deviceHeight / (max * 2))

		// Invert x position
		posX = deviceWidth - posX

		//console.log('Device Motion: ', x, y, ' Moving to: ', posX, posY)
		indicator.style.transform = 'translate(' + posX + 'px, ' + posY + 'px)'

		updateBot(x, y)
	})

	/**
	 * Makes an API call to update the robot if necessary
	 */
	var LAST_ACTION = 'stop'
	var lastReq = null
	function updateBot(x, y) {
		var action
		if (Math.abs(x) <= 1 && Math.abs(y) <= 1) {
			action = 'stop'
		} else if (y < 0 && Math.abs(y) > Math.abs(x)) {
			action = 'forward'
		} else if (y > 0 && y > Math.abs(x)) {
			action = 'backward'
		} else if (x < 0 && Math.abs(x) > Math.abs(y)) {
			action = 'right'
		} else if (x > 0 && x > Math.abs(y)) {
			action = 'left'
		}

		// Return early if our action matched the last action
		if (action === LAST_ACTION) return

		LAST_ACTION = action

		// Throttle requests to the server
		if (lastReq) {
			clearTimeout(lastReq)
		}
		lastReq = setTimeout(function() {
			console.log('Sending request: ', action)
			drive(action)
		}, 500)
	}

	function drive(command) {
		var args = []

		switch(command) {
			case 'stop':
				args = ['A0,90', 'A1,90']
				break;
			case 'forward':
				args = ['A0,180', 'A1,0']
				break;
			case 'backward':
				args = ['A0,0', 'A1,180']
				break;
			case 'left':
				args = ['A0,90', 'A1,0']
				break;
			case 'right':
				args = ['A0,180', 'A1,90']
				break;
		}

		args.forEach(function(arg) {
			var req = new XMLHttpRequest()
			req.open('POST', 'https://api.spark.io/v1/devices/' + config.deviceId + '/servowrite', true)
			req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
			//req.setRequestHeader('Content-type', 'application/json')
			//req.responseType = 'json'
			req.onload = function() {
				console.log('Request done: ', req.responseText)
			}
			req.onerror = function(e) {
				console.log('Request error: ', e)
			}
			req.send('access_token=' + config.token + '&args=' + arg);
		})
	}
}())
