#include "ax12.h"
#include "BioloidController.h"

BioloidController bioloid = BioloidController(1000000);

// Octopod pin constants.
// Looking down at the octopod's back, with the head at the top.
#define l1CoxaId     0   // Front Left leg Hip Horizontal
#define l1FemurId    8   // Front Left leg Hip Vertical
#define l1TibiaId    16  // Front Left leg Knee

#define l2CoxaId     1   // Middle Left Front leg Hip Horizontal
#define l2FemurId    9   // Middle Left Front leg Hip Vertical
#define l2TibiaId    17  // Middle Left Front leg Knee

#define l3CoxaId     2   // Middle Left Rear leg Hip Horizontal
#define l3FemurId    10  // Middle Left Rear leg Hip Vertical
#define l3TibiaId    18  // Middle Left Rear leg Knee

#define l4CoxaId     3   // Rear Left leg Hip Horizontal
#define l4FemurId    11  // Rear Left leg Hip Vertical
#define l4TibiaId    19  // Rear Left leg Knee

#define r1CoxaId     7   // Front Right leg Hip Horizontal
#define r1FemurId    15  // Front Right leg Hip Vertical
#define r1TibiaId    23  // Front Right leg Knee

#define r2CoxaId     6   // Middle Right Front leg Hip Horizontal
#define r2FemurId    14  // Middle Right Front leg Hip Vertical
#define r2TibiaId    22  // Middle Right Front leg Knee

#define r3CoxaId     5   // Middle Right Rear leg Hip Horizontal
#define r3FemurId    13  // Middle Right Rear leg Hip Vertical
#define r3TibiaId    21  // Middle Right Rear leg Knee

#define r4CoxaId     4   // Rear Right leg Hip Horizontal
#define r4FemurId    12  // Rear Right leg Hip Vertical
#define r4TibiaId    20  // Rear Right leg Knee

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

