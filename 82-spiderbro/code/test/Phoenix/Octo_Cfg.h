#ifndef OCTO_CFG_H
#define OCTO_CFG_H

#define OCTOMODE            // We are building for octo support...
#define ADJUSTABLE_LEG_ANGLES
//==================================================================================================================================
// Define which input classes we will use. If we wish to use more than one we need to define USEMULTI - This will define a forwarder
//    type implementation, that the Inputcontroller will need to call.  There will be some negotion for which one is in contol.
//
//  If this is not defined, The included Controller should simply implement the InputController Class...
//==================================================================================================================================
#define USECOMMANDER

// Global defines to control which configuration we are using.  Note: Only define one of these...
// 
// Which type of control(s) do you want to compile in
#if defined(__MK20DX256__)
#define DBGSerial         Serial
#else
#if defined(UBRR2H)
#define DBGSerial         Serial
#endif
#endif 

// Define other optional compnents to be included or not...
//#define PHANTOMX_V2     // Some code may depend on it being a V2 PhantomX
#define cFemurHornOffset1 -35 // -70
#define cTibiaHornOffset1 463 //380
#define r4TibiaInv 0 
#define r3TibiaInv 0 
#define r2TibiaInv 0 
#define r1TibiaInv 0 
#define l4TibiaInv 1 
#define l3TibiaInv 1 
#define l2TibiaInv 1 
#define l1TibiaInv 1 

#define BALANCE_DELAY 25    // don't add as much as the default here.

//===================================================================
// Debug Options
#ifdef DBGSerial
#define OPT_TERMINAL_MONITOR  
#endif

//#define DEBUG_IOPINS
#ifdef DEBUG_IOPINS
#define DebugToggle(pin)  {digitalWrite(pin, !digitalRead(pin));}
#define DebugWrite(pin, state) {digitalWrite(pin, state);}
#else
#define DebugToggle(pin)  {;}
#define DebugWrite(pin, state) {;}
#endif


// Also define that we are using the AX12 driver
#define USE_AX12_DRIVER
#define OPT_BACKGROUND_PROCESS    // The AX12 has a background process
//#define OPT_GPPLAYER
//#define OPT_SINGLELEG
#define OPT_DYNAMIC_ADJUST_LEGS
//#define ADJUSTABLE_LEG_ANGLES


//==================================================================================================================================
//==================================================================================================================================
//==================================================================================================================================
//  PhantomX
//==================================================================================================================================
//[SERIAL CONNECTIONS]

//====================================================================
// XBEE on non mega???
#if defined(__MK20DX256__)
#define XBeeSerial Serial2
#else
#if defined(UBRR2H)
#define XBeeSerial Serial2
#endif
#define XBeeSerial Serial
#endif
#define XBEE_BAUD        38400
#define DISP_VOLTAGE    // User wants the Battery voltage to be displayed...
#define DISP_VOLTAGE_TIME  1000  // how often to check and report in millis
//--------------------------------------------------------------------
//[Arbotix Pin Numbers]
#if defined(__MK20DX256__)
#define SOUND_PIN    6
#else
#define USER 0    // defaults to 13 but Arbotix on 0...
#define SOUND_PIN    1 //0xff        // Tell system we have no IO pin...
#endif
#define PS2_DAT      A0        
#define PS2_CMD      A1
#define PS2_SEL      A2
#define PS2_CLK      A3

// Define Analog pin and minimum voltage that we will allow the servos to run
#if defined(__MK20DX256__)
// Our Teensy board
#define cVoltagePin  0

#define CVADR1      402  // VD Resistor 1 - reduced as only need ratio... 40.2K and 10K
#define CVADR2      100    // VD Resistor 2
#define CVREF       330    // 3.3v
#endif
//#define cVoltagePin  7      // Use our Analog pin jumper here...
//#define CVADR1      1000  // VD Resistor 1 - reduced as only need ratio... 20K and 4.66K
//#define CVADR2      233   // VD Resistor 2
#define cTurnOffVol  1000     // 10v
#define cTurnOnVol   1100     // 11V - optional part to say if voltage goes back up, turn it back on...

//====================================================================
#define  DEFAULT_GAIT_SPEED 35  // Default gait speed  - Will depend on what Servos you are using...
#define  DEFAULT_SLOW_GAIT  50  // Had a couple different speeds...

//====================================================================
// Defines for Optional XBee Init and configuration code.
//====================================================================
#define CHECK_AND_CONFIG_XBEE
#define DEFAULT_MY 0x101  // Swap My/DL on 2nd unit
#define DEFAULT_DL 0x102
#define DEFAULT_ID 0x3332


//--------------------------------------------------------------------
// Define which pins(sevo IDS go with which joint
// Joints are defined from front to rear (1 to 4)
// and as if you are the robot, and looking out of its eyes.

//         * FRONT *
//         L1    R1
//          |    |
//           \  /
//     L2 ----/\---- R2
//           |  |
//     L3 ----\/---- R3
//           /  \
//          |    |
//         L4     R4
//      * POWER SWITCH *

#define l1CoxaPin      0    //Front Right leg Hip Horizontal
#define l1FemurPin     8    //Front Right leg Hip Vertical
#define l1TibiaPin     16   //Front Right leg Knee

#define l2CoxaPin      1    //Front Mid Right leg Hip Horizontal
#define l2FemurPin     9    //Front Mid Right leg Hip Vertical
#define l2TibiaPin     17   //Front Mid Right leg Knee

#define l3CoxaPin      2    //Rear Mid Right leg Hip Horizontal
#define l3FemurPin     10   //Rear Mid Right leg Hip Vertical
#define l3TibiaPin     18   //Rear Mid Right leg Knee

#define l4CoxaPin      3    //Rear Right leg Hip Horizontal
#define l4FemurPin     11   //Rear Right leg Hip Vertical
#define l4TibiaPin     19   //Rear Right leg Knee

#define r1CoxaPin      7    //Front Left leg Hip Horizontal
#define r1FemurPin     15   //Front Left leg Hip Vertical
#define r1TibiaPin     23   //Front Left leg Knee

#define r2CoxaPin      6    //Front Mid Left leg Hip Horizontal
#define r2FemurPin     14   //Front Mid Left leg Hip Vertical
#define r2TibiaPin     22   //Front Mid Left leg Knee

#define r3CoxaPin      5    //Rear Mid Left leg Hip Horizontal
#define r3FemurPin     13   //Rear Mid Left leg Hip Vertical
#define r3TibiaPin     21   //Rear Mid Left leg Knee

#define r4CoxaPin      4    //Rear Left leg Hip Horizontal
#define r4FemurPin     12   //Rear Left leg Hip Vertical
#define r4TibiaPin     20   //Rear Left leg Knee

//--------------------------------------------------------------------
//[MIN/MAX ANGLES] - Warning - remember that some servos direction is 
// inverted in code after we do the conversions.  So the Right legs need
// to have their Min/Max values negated from what is seen on the actual robot
// servo positions...
//1:224(-843) 797(834)
//3:159(-1034) 862(1025)
//5:277(-688) 864(1031)
//7:223(-846) 798(837)
//9:160(-1031) 858(1013)
//11:283(-670) 863(1028)
//2:220(-855) 797(834)
//4:163(-1022) 863(1028)
//6:158(-1037) 747(688)
//8:220(-855) 801(846)
//10:255(-752) 861(1022)
//12:125(-1133) 746(685)
#define r1CoxaMin1     -750
#define r1CoxaMax1      750
#define r1FemurMin1   -1000
#define r1FemurMax1    1000
#define r1TibiaMin1   -1020
#define r1TibiaMax1     670

#define r2CoxaMin1      -750
#define r2CoxaMax1       750
#define r2FemurMin1    -1000
#define r2FemurMax1     1000
#define r2TibiaMin1    -1020
#define r2TibiaMax1      670

#define r3CoxaMin1      -750
#define r3CoxaMax1       750
#define r3FemurMin1    -1000
#define r3FemurMax1     1000
#define r3TibiaMin1    -1020
#define r3TibiaMax1      670

#define r4CoxaMin1      -750
#define r4CoxaMax1       750
#define r4FemurMin1    -1000
#define r4FemurMax1     1000
#define r4TibiaMin1    -1020
#define r4TibiaMax1      670

#define l1CoxaMin1     -750
#define l1CoxaMax1      750
#define l1FemurMin1   -1000
#define l1FemurMax1    1000
#define l1TibiaMin1   -1020
#define l1TibiaMax1     670

#define l2CoxaMin1      -750
#define l2CoxaMax1       750
#define l2FemurMin1    -1000
#define l2FemurMax1     1000
#define l2TibiaMin1    -1020
#define l2TibiaMax1      670

#define l3CoxaMin1      -750
#define l3CoxaMax1       750
#define l3FemurMin1    -1000
#define l3FemurMax1     1000
#define l3TibiaMin1    -1020
#define l3TibiaMax1      670

#define l4CoxaMin1      -750
#define l4CoxaMax1       750
#define l4FemurMin1    -1000
#define l4FemurMax1     1000
#define l4TibiaMin1    -1020
#define l4TibiaMax1      670


//--------------------------------------------------------------------
//[Joint offsets]
// This allows us to calibrate servos to some fixed position, and then adjust them by moving theim
// one or more servo horn clicks.  This requires us to adjust the value for those servos by 15 degrees
// per click.  This is used with the T-Hex 4DOF legs
//First calibrate the servos in the 0 deg position using the SSC-32 reg offsets, then:
//--------------------------------------------------------------------
//[LEG DIMENSIONS]
//Universal dimensions for each leg in mm
#define defaultCoxaLength     52    // PhantomX leg dimensions.
#define defaultFemurLength    65
#define defaultTibiaLength    133

#define r1CoxaLength     defaultCoxaLength
#define r1FemurLength    defaultFemurLength
#define r1TibiaLength    defaultTibiaLength

#define r2CoxaLength     defaultCoxaLength
#define r2FemurLength    defaultFemurLength
#define r2TibiaLength    defaultTibiaLength

#define r3CoxaLength     defaultCoxaLength
#define r3FemurLength    defaultFemurLength
#define r3TibiaLength    defaultTibiaLength

#define r4CoxaLength     defaultCoxaLength
#define r4FemurLength    defaultFemurLength
#define r4TibiaLength    defaultTibiaLength

#define l1CoxaLength     defaultCoxaLength
#define l1FemurLength    defaultFemurLength
#define l1TibiaLength    defaultTibiaLength

#define l2CoxaLength     defaultCoxaLength
#define l2FemurLength    defaultFemurLength
#define l2TibiaLength    defaultTibiaLength

#define l3CoxaLength     defaultCoxaLength
#define l3FemurLength    defaultFemurLength
#define l3TibiaLength    defaultTibiaLength

#define l4CoxaLength     defaultCoxaLength
#define l4FemurLength    defaultFemurLength
#define l4TibiaLength    defaultTibiaLength

//--------------------------------------------------------------------
//[BODY DIMENSIONS]
//Default Coxa setup angle, decimals = 1
#define r1CoxaAngle1    450
#define r2CoxaAngle1      0
#define r3CoxaAngle1      0
#define r4CoxaAngle1   -450

#define l1CoxaAngle1    450
#define l2CoxaAngle1      0
#define l3CoxaAngle1      0
#define l4CoxaAngle1   -450

#define X_COXA          180    // MM between front and back legs /2
#define Y_COXA          180    // MM between front/back legs /2
#define M_COXA          100    // MM between two middle legs /2

#define r1OffsetX       -60    //Distance X from center of the body to the Right Front coxa
#define r1OffsetZ      -180    //Distance Z from center of the body to the Right Front coxa

#define r2OffsetX      -100    //Distance X from center of the body to the Right Middle Front coxa
#define r2OffsetZ       -60    //Distance Z from center of the body to the Right Middle Front coxa

#define r3OffsetX      -100    //Distance X from center of the body to the Right Middle Rear coxa
#define r3OffsetZ        60    //Distance Z from center of the body to the Right Middle Rear coxa

#define r4OffsetX       -60    //Distance X from center of the body to the Right Rear coxa
#define r4OffsetZ       180    //Distance Z from center of the body to the Right Rear coxa

#define l1OffsetX        60    //Distance X from center of the body to the Left Front coxa
#define l1OffsetZ      -180    //Distance Z from center of the body to the Left Front coxa

#define l2OffsetX       100    //Distance X from center of the body to the Left Middle Front coxa
#define l2OffsetZ       -60    //Distance Z from center of the body to the Left Middle Front coxa

#define l3OffsetX       100    //Distance X from center of the body to the Left Middle Rear coxa
#define l3OffsetZ        60    //Distance Z from center of the body to the Left Middle Rear coxa

#define l4OffsetX        60    //Distance X from center of the body to the Left Rear coxa
#define l4OffsetZ       180    //Distance Z from center of the body to the Left Rear coxa


//--------------------------------------------------------------------
//[START POSITIONS FEET]
#define cHexInitXZ	 147
#define CHexInitXZCos60  104        // COS(45) = .707
#define CHexInitXZSin60  104    // sin(45) = .707
#define CHexInitY	 25 //30

// Lets try some multi leg positions depending on height settings.
#define CNT_HEX_INITS 2
#define MAX_BODY_Y  150
#ifdef DEFINE_HEX_GLOBALS
const byte g_abHexIntXZ[] PROGMEM = {cHexInitXZ, 144};
const byte g_abHexMaxBodyY[] PROGMEM = { 20, MAX_BODY_Y};
#else
extern const byte g_abHexIntXZ[] PROGMEM;
extern const byte g_abHexMaxBodyY[] PROGMEM;
#endif

#define r1InitPosX     CHexInitXZCos60      //Start positions of the Right Front leg
#define r1InitPosY     CHexInitY
#define r1InitPosZ     -CHexInitXZSin60

#define r2InitPosX     cHexInitXZ      //Start positions of the Right Middle leg
#define r2InitPosY     CHexInitY
#define r2InitPosZ     0

#define r3InitPosX     cHexInitXZ      //Start positions of the Right Middle leg
#define r3InitPosY     CHexInitY
#define r3InitPosZ     0

#define r4InitPosX     CHexInitXZCos60      //Start positions of the Right Rear leg
#define r4InitPosY     CHexInitY
#define r4InitPosZ     CHexInitXZSin60

#define l1InitPosX     CHexInitXZCos60      //Start positions of the Left Front leg
#define l1InitPosY     CHexInitY
#define l1InitPosZ     -CHexInitXZSin60

#define l2InitPosX     cHexInitXZ      //Start positions of the Left Middle leg
#define l2InitPosY     CHexInitY
#define l2InitPosZ     0

#define l3InitPosX     cHexInitXZ      //Start positions of the Left Middle leg
#define l3InitPosY     CHexInitY
#define l3InitPosZ     0

#define l4InitPosX     CHexInitXZCos60      //Start positions of the Left Rear leg
#define l4InitPosY     CHexInitY
#define l4InitPosZ     CHexInitXZSin60

//--------------------------------------------------------------------
#endif // HEX_CFG_H

