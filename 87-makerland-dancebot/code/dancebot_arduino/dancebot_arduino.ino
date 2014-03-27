#include <Servo.h>

Servo head;
Servo arm1;
Servo arm2;

int headCenter = 105;
int headRange = 35;

int minHeadRange = headCenter - headRange;
int maxHeadRange = headCenter + headRange;

int minArmRange = 40;
int maxArmRange = 140;

void setup() {
  arm1.attach(9);
  arm2.attach(10);
  head.attach(11);
  head.write(105);
  Serial.begin(9600); // open a serial connection to your computer
  
  head.write(50);
  arm1.write(40);
  arm2.write(140);
  
}

void loop() {
 
  int headTo = random(minHeadRange, maxHeadRange);
  int arm1To = random(maxArmRange, minArmRange);
  int arm2To = random(minArmRange, maxArmRange);
/*
  head.write(headTo);
  arm1.write(arm1To);
  arm2.write(arm2To);
*/
  delay(500);
}



