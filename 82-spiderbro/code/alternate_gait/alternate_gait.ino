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


struct LegPos {
  int upper;
  int middle;
  int lower;
};

LegPos* record;

LegPos legs[] = {
  {l1CoxaId, l1FemurId, l1TibiaId},
  {l2CoxaId, l2FemurId, l2TibiaId},
  {l3CoxaId, l3FemurId, l3TibiaId},
  {l4CoxaId, l4FemurId, l4TibiaId},
  {r1CoxaId, r1FemurId, r1TibiaId},
  {r2CoxaId, r2FemurId, r2TibiaId},
  {r3CoxaId, r3FemurId, r3TibiaId},
  {r4CoxaId, r4FemurId, r4TibiaId}
};

void setup() {
  Serial.begin(9600);
  record = (LegPos*) malloc(sizeof(record) * 20);

  for (int i = 0; i < sizeof(legs)/sizeof(LegPos); i++) {
    Relax(legs[i].upper);
    delay(3);
    Relax(legs[i].middle);
    delay(3);
    Relax(legs[i].lower);
    delay(3);
  }
}

boolean hasRecord = false;
void loop() {
  if (!hasRecord) {
    hasRecord = true;
    Serial.println("Recording in 2 seconds");
    delay(2000);

    for (int i = 0; i < 20; i++) {
      record[i].upper = ax12GetRegister(5, 36, 2);
      record[i].middle = ax12GetRegister(13, 36, 2);
      record[i].lower = ax12GetRegister(21, 36, 2);

      Serial.print("Recording leg. ");
      Serial.print(i);
      Serial.print(" - ");
      Serial.print(record[i].upper);
      Serial.print(" - ");
      Serial.print(record[i].middle);
      Serial.print(" - ");
      Serial.println(record[i].lower);

      delay(200);
    }
    
    Serial.println("Playback in 2 seconds");
    delay(2000);
  }
  
  int spd = 50;
  
  for (int i = 0; i < 20; i++) {
      for (int j = 0; j < sizeof(legs)/sizeof(LegPos); j++) {

        int stepNum = i;
        
        if (j % 2 == 1) {
          stepNum += 10;
          stepNum = stepNum % 20;
        }
        
        if (j > 3) {
          servoWrite(legs[j].upper, record[stepNum].upper, spd);
          servoWrite(legs[j].middle, record[stepNum].middle, spd);
          servoWrite(legs[j].lower, record[stepNum].lower, spd);
        } else {
          servoWrite(legs[j].upper, 1024 - record[stepNum].upper, spd);
          servoWrite(legs[j].middle, 1024 - record[stepNum].middle, spd);
          servoWrite(legs[j].lower, 1024 - record[stepNum].lower, spd);
        }

        delay(30);
      }
  }
}

