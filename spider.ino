#include <ax12.h>
#include <BioloidController.h>

BioloidController bioloid = BioloidController(1000000);

#define AX_SYNC_WRITE 131
#define AX_GOAL_POSITION_L 30
#define BIOLOID_SHIFT 3

void writeServo(int id, int pos){
    int poseSize = 1;
    int temp;
    int length = 4 + (poseSize * 3);   // 3 = id + pos(2byte)
    int checksum = 254 + length + AX_SYNC_WRITE + 2 + AX_GOAL_POSITION_L;
    setTXall();
    ax12write(0xFF);
    ax12write(0xFF);
    ax12write(0xFE);
    ax12write(length);
    ax12write(AX_SYNC_WRITE);
    ax12write(AX_GOAL_POSITION_L);
    ax12write(2);
//    for(int i=0; i<poseSize; i++)
//    {
        checksum += pos + (pos>>8) + id;
        ax12write(id);
        ax12write(pos);
        ax12write(pos>>8);
//    } 
    ax12write(0xff - (checksum % 256));
    setRX(0);
}

void writeSpeed(int id, int pos){
    setTXall();
    ax12write(0xFF);
    ax12write(0xFF);
    ax12write(0x00);
    ax12write(0x07);
    ax12write(0x03);
    ax12write(0x01E);
    ax12write(0x00);
    ax12write(0x02);
    ax12write(0x00);
    ax12write(0x02);
    ax12write(0xD3);
    setRX(0);
}

void setup() {
  Serial.begin(9600);
}

void loop() {
  
  writeServo(20, 512);
  writeSpeed(20, 512);
  
  //int pos = bioloid.getCurPose(20);
  int iSpeed =  ax12GetRegister(20, 38, 2);
  int iPos =  ax12GetRegister(20, 36, 2);
  Serial.print("Get pos/speed: ");
  Serial.print(iPos);
  Serial.print(" / ");
  Serial.println(iSpeed);
  delay(20);
}

