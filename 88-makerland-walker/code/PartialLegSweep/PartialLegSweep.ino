#include <Servo.h>

Servo leftSet;
Servo rightSet;

void setup() {
  leftSet.attach(10);
  rightSet.attach(11);
  Serial.begin(9600); // open a serial connection to your computer
}

int pos = 0;
int minSweep = 65;
int maxSweep = 115;

void loop() {
  for(pos = minSweep; pos < maxSweep; pos += 1)
  {
    leftSet.write(pos);
    rightSet.write(pos);
    delay(15);
  }

  for(pos = maxSweep; pos > minSweep; pos-=1)
  {                                
    leftSet.write(pos);
    rightSet.write(pos);
    delay(15);
  } 

}


