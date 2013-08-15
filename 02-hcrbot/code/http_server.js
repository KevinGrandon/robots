//////////////////////////////////////////////
////// HTTP Server for controls
//////////////////////////////////////////////
var robot
var express = require('express')
var https = require('https')
var fs = require('fs')
var app = express()

app.use(express.static('www'));

app.get('/voice/:command', function(req, res){
	var command = req.params.command

	console.log('Got voice command: ', command)

	if (command == 'stop') {
		robot.say('Ok stopping.')
		robot.doKinectTracking = false
	} else if (command == 'follow') {
		robot.say('Following you.')
		robot.doKinectTracking = true
	} else if (command == 'patrol') {
		robot.say('Starting patrol in 10 seconds.')
	}
})

/*
// Uncomment for HTTP voice commands.
var options = {
  key: fs.readFileSync(__dirname + "/keys/key.pem"),
  cert: fs.readFileSync(__dirname + "/keys/cert.pem")
}
https.createServer(options, app).listen(443);
*/
app.listen(80)
console.log('Server started!')

/**
 * Sets the robot reference
 */
exports.init = function(ref) {
	robot = ref
}