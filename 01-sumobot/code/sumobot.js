var express = require('express')
var http = require('http')
var app = express()
var path = require('path')
var bot

app.use(express.static(__dirname + '/public'))

var UP_ARROW = 38
var DOWN_ARROW = 40
var LEFT_ARROW = 37
var RIGHT_ARROW = 39

var down = {}

function markDown(code) {
	down[code] = true
}

function markUp(code) {
	delete down[code]
}

// Going FORWARD (up arrow)
app.get('/keydown/' + UP_ARROW, function(req, res){
	markDown(UP_ARROW)
	bot.fwd(5)
  res.send('Moving forward')
})

// Going LEFT (left arrow)
app.get('/keydown/' + LEFT_ARROW, function(req, res){
	markDown(LEFT_ARROW)
	bot.left(250)
  res.send('Turning left')
})

// Going RIGHT (right arrow)
app.get('/keydown/' + RIGHT_ARROW, function(req, res){
	markDown(RIGHT_ARROW)
	bot.right(250)
	res.send('Turning right')
})

// Reversing (down arrow)
app.get('/keydown/' + DOWN_ARROW, function(req, res){
	markDown(DOWN_ARROW)
	bot.rev()
  res.send('Stopping')
})

// End Reversing (down arrow)
app.get('/keyup/' + DOWN_ARROW, function(req, res){
	markUp(DOWN_ARROW)
	bot.stop()
  res.send('Stopping')
})

// Reversing (down arrow)
var ATTACK = 65 // (A key)
var state = 'down'
var attackServo
app.get('/keydown/' + ATTACK, function(req, res){
	attackServo.max()
  res.send('Turning servo on')
})

app.get('/keyup/' + ATTACK, function(req, res){
	attackServo.center()
  res.send('Turning servo off')
})

// Use 'A' and 'S' keys to trap opponenets on the ramp.
var LETGO = 83 // (S key)
app.get('/keydown/' + LETGO, function(req, res){
	attackServo.min()
  res.send('Turning servo on')
})

app.get('/keyup/' + LETGO, function(req, res){
	attackServo.center()
  res.send('Turning servo off')
})

app.listen(8080)
console.log('Listening on port 8080')

// Initialize robot
var five

five = require("johnny-five");

five.Board().on("ready", function() {


	attackServo = new five.Servo({
		pin: 11,
		range: [0, 180],
		type: 'continuous',
		startAt: 90,
		center: false		
	})

	bot = new five.Nodebot({
		right: 12,
		left: 13
	});

	this.repl.inject({
		n: bot
	});
});

// Open the browser on startup!
var sys = require('sys')
var exec = require('child_process').exec
function openBrowser(error, stdout, stderr) { console.log('Opening browser...') }
exec('/Applications/FirefoxNightly.app/Contents/MacOS/firefox http://localhost:8080/', openBrowser)

