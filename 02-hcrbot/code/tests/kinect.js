var OpenNI = require('openni');

var context = OpenNI();

context.setJoints(['head']);

context.startCOMTracking();

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
		console.log('--------------------------------------------------------------')
		console.log('User %d emitted event: %s', userId, eventType);
		console.log('--------------------------------------------------------------')
	});
});

context.on('com_position', function(user, x, y, z) {
	console.log('user %d moved to (%d, %d, %d)', user, x, y, z);
});
