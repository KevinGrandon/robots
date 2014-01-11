var pinio = new (require('pinio')).Pinio()

pinio.on('ready', function(board) {


	var pot = board.pins('A3')
	pot.read(function(val) {
		console.log('Val is:', val)
	})

	/*
    var motor1 = board.pins(2)
    var motor2 = board.pins(3)
    motor1.output()

    /*
    motor2.output()
    var current = 1

    setInterval(function() {

    	if (current) {
			motor1.high()
			motor2.low()
    	} else {
        	motor1.low()
			motor2.high()
    	}

    	current = 1 - current
    }, 4000)
	*/

	/*
	motor1.high()

	var val = 255
	setInterval(function doWrite() {
		motor2.pwm(val)
		val--
		console.log('Writing val: ', val)
		if (val <= 1) {
			motor2.output()
			motor2.high()
			motor1.high()
			clearTimeout(doWrite)
		}
	}, 500);
*/
})

