#include <Servo.h>

// When looking down from the rear of the robot.

Servo fl;
Servo fr;
Servo rl;
Servo rr;

void setup() {
  fl.attach(10);
  fr.attach(11);
  rr.attach(9);
  rl.attach(6);
  Serial.begin(9600); // open a serial connection to your computer
}

int pos = 0;

int forwardStartSweep = 70;
int forwardEndSweep = 110;

boolean forward = true;


void loop() {
  
  if (forward) {

    fl.write(90);
    rr.write(90);
    
    for(pos = forwardStartSweep; pos < forwardEndSweep; pos += 1) {
      fr.write(pos);
      rl.write(180 - pos);
      delay(15);
    }

    fr.write(90);
    rl.write(90);

    for(pos = forwardEndSweep; pos > forwardStartSweep; pos -= 1) {
      fl.write(pos);
      rr.write(180 - pos);
      delay(15);
    }

  } else {

    fr.write(90);
    rl.write(90);
    
    for(pos = forwardStartSweep; pos < forwardEndSweep; pos += 1) {
      fl.write(pos);
      rr.write(180 - pos);
      delay(15);
    }

    fl.write(90);
    rr.write(90);

    for(pos = forwardEndSweep; pos > forwardStartSweep; pos -= 1) {
      fr.write(pos);
      rl.write(180 - pos);
      delay(15);
    }
  }

  delay(100);
}


