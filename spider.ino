#include "ax12.h"
#include "BioloidController.h"

BioloidController bioloid = BioloidController(1000000);

// Octopod pin constants.
// Looking down at the octopod's back, with the head at the top.
int 

// AX Servo Constants
#define AX_SYNC_WRITE 131
#define AX_GOAL_POSITION_L 30

void servoWrite(int id, int pos, int spd){
    int poseSize = 1;
    int temp;
    int length = 4 + (poseSize * 5);
    int checksum = 254 + length + AX_SYNC_WRITE + 4 + AX_GOAL_POSITION_L;
    setTXall();
    ax12write(0xFF);
    ax12write(0xFF);
    ax12write(0xFE);
    ax12write(length);
    ax12write(AX_SYNC_WRITE);
    ax12write(AX_GOAL_POSITION_L);
    ax12write(4);
//    for(int i=0; i<poseSize; i++)
//    {
        checksum += pos + (pos>>8) + spd + (spd>>8) + id;
        ax12write(id);
        ax12write(pos);
        ax12write(pos>>8);
        ax12write(spd);
        ax12write(spd>>8);
//    } 
    ax12write(0xff - (checksum % 256));
    setRX(0);
}


void setup() {
  Serial.begin(9600);
  
    servoWrite(20, 512, 200);
}

void loop() {
  int pos =  ax12GetRegister(20, 36, 2);
  Serial.print("Get pos: ");
  Serial.println(pos);
  delay(20);
}

