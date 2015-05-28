var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function() {

  var motor1 = new five.Motor({
    pins: {
      pwm: 9,
      dir: 7
    }
  });

  var motor2 = new five.Motor({
    pins: {
      pwm: 10,
      dir: 8
    }
  });

  function motorControl(out) {
    var velocity = Math.abs(out);
    if (velocity < 0) {
      velocity = 0;
    }
    if (velocity > 255) {
      velocity = 255;
    }

    if (out > 0) {
      motor1.forward(velocity);
      motor2.forward(velocity);
    } else {
      motor1.reverse(velocity);
      motor2.reverse(velocity);
    }
  }

  var imu = new five.IMU({
    controller: 'MPU6050'
  });

  imu.on('change', function() {  
    console.log('accelerometer');
    console.log('  x            : ', this.accelerometer.x);
    console.log('  y            : ', this.accelerometer.y);
    console.log('  z            : ', this.accelerometer.z);
    console.log('  pitch        : ', this.accelerometer.pitch);
    console.log('  roll         : ', this.accelerometer.roll);
    console.log('  acceleration : ', this.accelerometer.acceleration);
    console.log('  inclination  : ', this.accelerometer.inclination);
    console.log('  orientation  : ', this.accelerometer.orientation);
    console.log('--------------------------------------');
    
    console.log('gyro');
    console.log('  x            : ', this.gyro.x);
    console.log('  y            : ', this.gyro.y);
    console.log('  z            : ', this.gyro.z);
    console.log('  pitch        : ', this.gyro.pitch);
    console.log('  roll         : ', this.gyro.roll);
    console.log('  yaw          : ', this.gyro.yaw);
    console.log('  rate         : ', this.gyro.rate);
    console.log('  isCalibrated : ', this.gyro.isCalibrated);
    console.log('--------------------------------------');    
  });

});
