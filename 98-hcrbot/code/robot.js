function HCRBot(board) {

	this.topSpeed = 255

	this.defaultQueue = []

	this.board = board

	this.ready = false

	this.speedLeft = 0
	this.speedRight = 0

	this.speed = 200
	this.queue = []
	this.loopQueue = []

	this.doKinectTracking = true
}

HCRBot.prototype = {
	handleBumper: function() {
		this.handleForwardObstacle()
	},
	handleIRSensor: function() {
		this.handleForwardObstacle()
	},
	handleForwardObstacle: function() {
		this.queue = [
		{
			control: 'stop',
			time: 500
		},
		{
			control: 'backward',
			time: 300
		},
		{
			control: 'gentleStop',
			time: 200
		},
		{
			control: 'stop',
			time: 500
		},
		{
			control: 'rightTurn',
			time: 100
		},
		{
			control: 'gentleStop',
			time: 200
		},
		{
			control: 'stop',
			time: 200
		},
		{
			control: 'resetLoopQueue',
			time: 0
		}]
		this.loopQueue = []
		this.control.stop()
	},
	processQueue: function() {
		var next = this.queue.shift()

		if (!next && this.loopQueue.length) {
			this.queue = Array.prototype.slice.call(this.loopQueue)
			next = this.queue.shift()
		} else if (!next) {
			//console.log('No queue item found!')
			return
		}

		var time = 0
		// We can queue custom functions which will return the duration
		// This is useful for running test scripts
		if (typeof next == 'function') {
			time = next(this)
		} else {
			this.control[next.control](this)
			time = next.time
		}

		setTimeout(this.processQueue.bind(this), time)
	},
	init: function() {
		console.log('Robot is initializing!')
		this.ready = true
		this.processQueue()
	},
	// Sets the control library
	setControl: function(control) {
		this.control = control
	},

	/**
	 * Called whenever the kinect detects motionof the user head
	 * Right now we just turn...
	 */
	updateTracking: function(user, x, y, z) {

		// Don't act on tracking too fast
		if (this.lastTrack && Date.now() - this.lastTrack < 400) {
			return
		}
		this.lastTrack = Date.now()

		var queueItem

		if (x > 100) {
			queueItem = {
				control: 'leftTurn',
				time: 250
			}
 		} else if (x < -100) {
			queueItem = {
				control: 'rightTurn',
				time: 250
			}
		} else if (z > 600) {
			queueItem = {
				control: 'forward',
				time: 500
			}
		}

		if (!queueItem)
			return

		var stop = {
			control: 'gentleStop',
			time: 150
		}

		this.queue = [queueItem, stop]
		this.processQueue()
	},

	say: function(content) {
		var sys = require('sys')
		var exec = require('child_process').exec
		function cb(error, stdout, stderr) { console.log('Saying ' + content) }
		exec('say "' + content + '"', cb)
	}
}

exports.HCRBot = HCRBot