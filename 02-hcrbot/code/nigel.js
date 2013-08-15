var robot

//////////////////////////////////////////////
////// OpenNI/Kinect Handling
//////////////////////////////////////////////
var OpenNI = require('openni');
var context = OpenNI();

context.setJoints(['head']);

[
  'newuser',
  'userexit',
  'lostuser',
  'posedetected',
  'calibrationstart',
  'calibrationsucceed',
  'calibrationfail'
].forEach(function(eventType) {
  context.on(eventType, function(userId) {
    console.log('User %d emitted event: %s', userId, eventType);
  });
});

context.startCOMTracking()

context.on('com_position', function(user, x, y, z) {

	// Return if the robot is not ready
	if (!robot || !robot.ready || !robot.doKinectTracking)
		return

	console.log('head user %d moved to (%d, %d, %d)', user, x, y, z);

	// Return if x, y, and z are all 0
	if (x == 0 && y == 0 && z == 0)
		return

	robot.updateTracking(user, x, y, z)
});

process.on('SIGINT', function() {
	context.close()
	process.exit()
})

//////////////////////////////////////////////
////// Base robot wrapper
//////////////////////////////////////////////
var pinio = new (require('pinio')).Pinio()

pinio.on('ready', function(board) {

	var HCRBot = require('./robot.js').HCRBot
	robot = new HCRBot(board)

	// Include robot libraries
	var control = require(__dirname + '/control.js')
	control.init(robot)
	robot.setControl(control)

	require(__dirname + '/bumpers.js').init(robot)
	require(__dirname + '/forward_distance_sensors.js').init(robot)


	setTimeout(function() {
		robot.loopQueue = []
		robot.defaultQueue = robot.loopQueue

		// Initialize the HTTP server
		require(__dirname + '/http_server.js').init(robot)

		robot.init()

		robot.say("Robot is now ready.")
	}, 2000)
})
