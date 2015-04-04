#include "ax12.h"
#include "BioloidController.h"
#include "poses.h"

// Enable to use XBee
//#define USE_XBEE

// Uncomment to step through each gait as we receive commands.
// #define STEP_THROUGH_GAITS

// If we're not using an XBEE, debug to serial.
#ifndef USE_XBEE
  #define DEBUG
#endif

BioloidController bioloid = BioloidController(1000000);

#ifdef USE_XBEE
#include <Commander.h>
Commander command = Commander();
#endif

const int SERVOCOUNT = 24;
int id;
int pos;
boolean IDCheck;
boolean RunCheck;

int runningGait = 0;
int leftTurningGait = 0;
int rightTurningGait = 0;

void setup(){
   pinMode(0,OUTPUT);  
   
   //initialize variables 
   id = 0;
   pos = 0;
   IDCheck = 1;
   RunCheck = 0;

  //open serial port
#ifdef USE_XBEE
  command.begin(38400);
#else
   Serial.begin(9600);
   Serial.println("###########################");
   Serial.println("Serial Communication Established.");
   Serial.println("###########################");
#endif
   delay (500);

  //Check Lipo Battery Voltage
  CheckVoltage();

  //Scan Servos, return position.
#ifdef DEBUG
  ScanServo();
  MenuOptions();
  RunCheck = 1;
#endif

  PoseStand();
}

void loop(){

  // Read input from Arbotix Commander.
#ifdef USE_XBEE
  if(command.ReadMsgs() > 0){
    // Top buttons control left/right turning.
    if(command.walkV > 0) {
      runningGait = 1;
    } else {
      runningGait = 0;
    }

    if(command.buttons & BUT_RT){
      rightTurningGait = 1;
    }else{
      rightTurningGait = 0;
    }

    if(command.buttons & BUT_LT){
      leftTurningGait = 1;
    }else{
      leftTurningGait = 0;
    }
  }
#endif

#ifdef DEBUG
  // Read input from serial.
  int inByte;
  if (Serial.available()) {
    inByte = Serial.parseInt();
    Serial.println("Got option: ");
    Serial.println(inByte);
  }

  switch (inByte) {
  case 1:
    ScanServo();
    break;

  case 2:
    MoveCenter();
    break;
    
   case 3:
    RelaxServos();
    break;     

  case 4:
    CheckVoltage();
    break;

  case 5:
    LEDTest();
    break;
    
  case 6: 
    StartSimpleGait();   
    break;

  case 7: 
    StartSimpleLeftTurnGait();   
    break;

  case 8: 
    StartSimpleRightTurnGait();   
    break;

  case 9:
    StopGait();
    break;  

  case 10:
    PoseStand();
    break;  
  } 
#endif

  if (runningGait == 1){
    // Commented out while we step through it manually.
    _runSimpleGaitStep();
  } else if(leftTurningGait == 1) {
    _runSimpleLeftTurnGaitStep();
  } else if(rightTurningGait == 1) {
    _runSimpleRightTurnGaitStep();
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

void StartSimpleLeftTurnGait(){
#ifdef DEBUG
  delay(100);
  Serial.println("###########################");
  Serial.println("Starting Simple Left Turn Gait");
  Serial.println("###########################"); 
#endif
  
  // Can step through gaits if this is enabled.
  #ifdef STEP_THROUGH_GAITS
    _runSimpleLeftTurnGaitStep();
  #else
    leftTurningGait = 1;
  #endif
  
  if (RunCheck == 1){
    MenuOptions();
  }
}

void StartSimpleRightTurnGait(){
#ifdef DEBUG
  delay(100);
  Serial.println("###########################");
  Serial.println("Starting Simple Right Turn Gait");
  Serial.println("###########################"); 
#endif
  
  // Can step through gaits if this is enabled.
  #ifdef STEP_THROUGH_GAITS
    _runSimpleRightTurnGaitStep();
  #else
    rightTurningGait = 1;
  #endif
  
  if (RunCheck == 1){
    MenuOptions();
  }
}


void StartSimpleGait(){
#ifdef DEBUG
  delay(100);
  Serial.println("###########################");
  Serial.println("Starting Simple Gait");
  Serial.println("###########################"); 
#endif
  
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
  leftTurningGait = 0;

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

void _runSimpleLeftTurnGaitStep(){
  // load the pose from FLASH, into the nextPose buffer
  switch (_simpleGaitStep) {
    case 0:
      bioloid.loadPose(SimpleLeftTurn1);
    break;
    case 1:
      bioloid.loadPose(SimpleLeftTurn2);
    break;
    case 2:
      bioloid.loadPose(SimpleLeftTurn3);
    break;
    case 3:
      bioloid.loadPose(SimpleLeftTurn4);
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

void _runSimpleRightTurnGaitStep(){
  // load the pose from FLASH, into the nextPose buffer
  switch (_simpleGaitStep) {
    case 0:
      bioloid.loadPose(SimpleRightTurn1);
    break;
    case 1:
      bioloid.loadPose(SimpleRightTurn2);
    break;
    case 2:
      bioloid.loadPose(SimpleRightTurn3);
    break;
    case 3:
      bioloid.loadPose(SimpleRightTurn4);
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
#ifdef DEBUG
  Serial.println("###########################");
  Serial.println("Standing.");
  Serial.println("###########################");    
#endif

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
    Serial.println("7) Start simple left turn gait");
    Serial.println("8) Start simple right turn gait");
    Serial.println("9) Reset gait");
    Serial.println("10) Stand up");
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
   
    
