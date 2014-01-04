var MOTOR_SPEED = 100


function Motor(config, board) {
	this.config = config

	this.pot = board.pins(config.pot)

	this.potAllowance = 2
	this.lastVal = false
	this.pot.read(this.read.bind(this))

	this.pwmPin = board.pins(config.pwmPin)
	this.dirPin = board.pins(config.dirPin)
    this.dirPin.output()
    this.pwmPin.output()
}

Motor.prototype = {
	/**
	 * Reads the value of the pot
	 */
	read: function(val) {
		if (Math.abs(this.lastVal - val) > this.potAllowance) {
			this.lastVal = val
			console.log(this.config.pot + ' Updated: ' + val)
			if (this.lastVal > this.config.max) {
				console.log(this.config.pot + ' min limit reached')
			} else if (this.lastVal < this.config.min) {
				console.log(this.config.pot + ' max limit reached')
			}
		}
	},

	/**
	 * Moves the motor clockwise
	 */
	cw: function() {
		console.log('Motor rotating clockwise', this.config.dirPin, this.config.pwmPin)
		this.dirPin.high()
		this.pwmPin.low()
		//this.pwmPin.pwm(MOTOR_SPEED)
	},

	/**
	 * Moves the motor counter-clockwise
	 */
	ccw: function() {
		console.log('Motor rotating counter-clockwise', this.config.dirPin, this.config.pwmPin)
		this.dirPin.low()
		this.pwmPin.high()
		//this.pwmPin.pwm(MOTOR_SPEED)
	},

	/**
	 * Stops the motor
	 */
	stop: function() {
		this.pwmPin.output()
		this.dirPin.high()
		this.pwmPin.high()
	},
}

exports.Motor = Motor