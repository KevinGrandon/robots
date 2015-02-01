#include <ax12.h>
#include <BioloidController.h>
#include "poses.h"

BioloidController bioloid = BioloidController(1000000);

const int SERVOCOUNT = 24;
int id;
int pos;
boolean IDCheck;
boolean RunCheck;

// #define STEP_THROUGH_GAITS
int runningGait = 0;

void setup(){
   pinMode(0,OUTPUT);  
   
   //initialize variables 
   id = 0;
   pos = 0;
   IDCheck = 1;
   RunCheck = 0;

  //open serial port
   Serial.begin(9600);
   delay (500);   
   Serial.println("###########################");    
   Serial.println("Serial Communication Established.");

  //Check Lipo Battery Voltage
  CheckVoltage();

  //Scan Servos, return position.
  ScanServo();
  MenuOptions();
  RunCheck = 1;
}

void loop(){
  // read the sensor:
  
  int inByte = Serial.read();

  switch (inByte) {

  case '1':    
    ScanServo();
    break;

  case '2':    
    MoveCenter();
    break;
    
   case '3':    
    RelaxServos();
    break;     

  case '4':    
    CheckVoltage();
    break;

  case '5':
    LEDTest();
    break;
    
  case '6': 
    StartSimpleGait();   
    break;
    
  case '7':
    StopGait();
    break;  

  case '8':
    PoseStand();
    break;  
  } 

  if (runningGait == 1){
    // Commented out while we step through it manually.
    _runSimpleGaitStep();
  }
}


void ScanServo(){
  id = 0;  
  Serial.println("###########################");
  Serial.println("Starting Servo Scanning Test.");
  Serial.println("###########################");
      
  while (id < SERVOCOUNT){
    pos =  ax12GetRegister(id, 36, 2);
    Serial.print("Servo ID: ");
    Serial.print(id);
    Serial.print(" Position: ");
    Serial.println(pos);
    
    if (pos <= 0){
      Serial.println("###########################");
      Serial.print("ERROR! Servo ID: ");
      Serial.print(id);
      Serial.println(" not found. Please check connection and verify correct ID is set.");
      Serial.println("###########################"); 
      IDCheck = 0;
    }
    
    id = (id++)%SERVOCOUNT;
  }
  delay(1000);
  if (IDCheck == 0){
    Serial.println("###########################");
    Serial.println("ERROR! Servo ID(s) are missing from Scan. Please check connection and verify correct ID is set.");
    Serial.println("###########################");  
  }
  else{
    Serial.println("All servo IDs present.");
  }
    if (RunCheck == 1){
    MenuOptions();
  }

}



void CheckVoltage(){  
   // wait, then check the voltage (LiPO safety)
  float voltage = (ax12GetRegister (1, AX_PRESENT_VOLTAGE, 1)) / 10.0;
  Serial.println("###########################");   
  Serial.print ("System Voltage: ");
  Serial.print (voltage);
  Serial.println (" volts.");
  if (voltage < 10.0){
    Serial.println("Voltage levels below 10v, please charge battery.");
    while(1);
  }  
  if (voltage > 10.0){
  Serial.println("Voltage levels nominal.");
  }
    if (RunCheck == 1){
      MenuOptions();
  }
      Serial.println("###########################"); 
}

void MoveCenter(){
    delay(100);                    // recommended pause
    bioloid.loadPose(Center);   // load the pose from FLASH, into the nextPose buffer
    bioloid.readPose();            // read in current servo positions to the curPose buffer
    Serial.println("###########################");
    Serial.println("Moving servos to centered position");
    Serial.println("###########################");    
    delay(1000);
    bioloid.interpolateSetup(1000); // setup for interpolation from current->next over 1/2 a second
    while(bioloid.interpolating > 0){  // do this while we have not reached our new pose
        bioloid.interpolateStep();     // move servos, if necessary. 
        delay(3);
    }
    if (RunCheck == 1){
      MenuOptions();
  }
}

void StartSimpleGait(){
  delay(100);
  Serial.println("###########################");
  Serial.println("Starting Simple Gait");
  Serial.println("###########################"); 
  delay(1000);
  
  // Can step through gaits if this is enabled.
  #ifdef STEP_THROUGH_GAITS
    _runSimpleGaitStep();
  #else
    runningGait = 1;
  #endif
  
  if (RunCheck == 1){
    MenuOptions();
  }
}

// Simple tripod gait.
int _simpleGaitStep = 0;

void StopGait(){
  Serial.println("###########################");
  Serial.println("Stopping Gaits");
  Serial.println("###########################"); 
  runningGait = 0;
  _simpleGaitStep = 0;
  if (RunCheck == 1){
    MenuOptions();
  }
}

void _runSimpleGaitStep() {
  // load the pose from FLASH, into the nextPose buffer
  switch (_simpleGaitStep) {
    // Raise and forward leg set 1
    case 0:
      bioloid.loadPose(SimpleRaiseSet1);
    break;
    // Lower and forward leg set 1
    case 1:
      bioloid.loadPose(SimpleLowerSet1);
    break;
    // Raise leg set 2 forward, while moving leg set 1.
    case 2:
      bioloid.loadPose(SimpleRaiseSet2);
    break;
    // Lower set 2.
    case 3:
      bioloid.loadPose(SimpleLowerSet2);
    break;
  }

  // read in current servo positions to the curPose buffer
  bioloid.readPose();

  bioloid.interpolateSetup(500); // setup for interpolation from current->next over 1/2 a second
  while(bioloid.interpolating > 0){  // do this while we have not reached our new pose
    bioloid.interpolateStep();     // move servos, if necessary. 
    delay(3);
  }
  _simpleGaitStep++;

  // Reset the current step.
  if (_simpleGaitStep > 3) {
    _simpleGaitStep = 0;
  }
}

void PoseStand(){
  delay(100);                    // recommended pause
  bioloid.loadPose(Standing);   // load the pose from FLASH, into the nextPose buffer
  bioloid.readPose();            // read in current servo positions to the curPose buffer
  Serial.println("###########################");
  Serial.println("Standing.");
  Serial.println("###########################");    
  delay(1000);
  bioloid.interpolateSetup(1000); // setup for interpolation from current->next over 1/2 a second
  while(bioloid.interpolating > 0){  // do this while we have not reached our new pose
      bioloid.interpolateStep();     // move servos, if necessary. 
      delay(3);
  }
  if (RunCheck == 1){
    MenuOptions();
}
}

void MenuOptions(){
    Serial.println("###########################"); 
    Serial.println("Please enter option 1-7 to run individual tests again.");     
    Serial.println("1) Servo Scanning Test");        
    Serial.println("2) Move Servos to Center");        
    Serial.println("3) Relax Servos");
    Serial.println("4) Check System Voltage"); 
    Serial.println("5) Perform LED Test");   
    Serial.println("6) Start simple gait");
    Serial.println("7) Reset gait");
    Serial.println("8) Stand up");
    Serial.println("###########################"); 
}

void RelaxServos(){
  id = 0;
  Serial.println("###########################");
  Serial.println("Relaxing Servos.");
  Serial.println("###########################");    
  while(id < SERVOCOUNT){
    Relax(id);
    id = (id++)%SERVOCOUNT;
    delay(50);
  }
   if (RunCheck == 1){
      MenuOptions();
  }
}


void LEDTest(){
    id = 0;
  Serial.println("###########################");
  Serial.println("Running LED Test");
  Serial.println("###########################");    
  while(id < SERVOCOUNT){
    ax12SetRegister(id, 25, 1);
    Serial.print("LED ON - Servo ID: ");
    Serial.println(id);
    delay(3000);
    ax12SetRegister(id, 25, 0);  
    Serial.print("LED OFF - Servo ID: ");
    Serial.println(id);    
    delay(3000);    
    id = id++;
  }
  
   if (RunCheck == 1){
      MenuOptions();
  }
}
   
    
