#ifndef POSES
#define POSES

#include <avr/pgmspace.h>

PROGMEM prog_uint16_t Center[] = {24, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512, 512};

// Standing:
PROGMEM prog_uint16_t Standing[] = {24,
	512, 512, 512, 512, 512, 512, 512, 512,
	412, 412, 412, 412, 612, 612, 612, 612,
	512, 512, 512, 512, 512, 512, 512, 512};

// Simple walking gait:
const int sRCoxaUp = 412;
const int sRCoxaDown = 612;
const int sLCoxaUp = 612;
const int sLCoxadDown = 412;

const int maxMovement = 45;
const int sRForward = 512 + maxMovement;
const int sRBackward = 512 - maxMovement;
const int sLForward = 512 - maxMovement;
const int sLBackward = 512 + maxMovement;

// A simple 4-step gait.
// Lift half, move forward.
PROGMEM prog_uint16_t SimpleRaiseSet1[] = {24,
	sLForward, sLBackward,   sLForward,  sLBackward,   sRForward, sRBackward,  sRForward, sRBackward,
	sLCoxaUp,  sLCoxadDown,  sLCoxaUp,   sLCoxadDown,  sRCoxaUp,  sRCoxaDown,  sRCoxaUp,  sRCoxaDown,
	512, 512, 512, 512, 512, 512, 512, 512};

// Place legs down, all legs on ground.
PROGMEM prog_uint16_t SimpleLowerSet1[] = {24,
        sLForward,   sLBackward,   sLForward,    sLBackward,  sRForward,   sRBackward,  sRForward,  sRBackward,
	sLCoxadDown, sLCoxadDown,  sLCoxadDown,  sLCoxadDown, sRCoxaDown,  sRCoxaDown,  sRCoxaDown, sRCoxaDown,
	512, 512, 512, 512, 512, 512, 512, 512};

// Lift other half, move forward.
PROGMEM prog_uint16_t SimpleRaiseSet2[] = {24,
	sLBackward,   sLForward,    sLBackward,  sLForward,  sRBackward,  sRForward, sRBackward,  sRForward,
	sLCoxadDown,  sLCoxaUp,   sLCoxadDown,   sLCoxaUp,   sRCoxaDown,  sRCoxaUp,  sRCoxaDown,  sRCoxaUp, 
	512, 512, 512, 512, 512, 512, 512, 512};

// Place legs down, all legs on ground.
PROGMEM prog_uint16_t SimpleLowerSet2[] = {24,
	sLBackward,   sLForward,    sLBackward,   sLForward,   sRBackward,  sRForward,   sRBackward,  sRForward,
	sLCoxadDown,  sLCoxadDown,  sLCoxadDown,  sLCoxadDown, sRCoxaDown,  sRCoxaDown,  sRCoxaDown,  sRCoxaDown,
	512, 512, 512, 512, 512, 512, 512, 512};


// A simple 4-step right-turn.
// Lift half, move forward.
PROGMEM prog_uint16_t SimpleRightTurn1[] = {24,
	sLForward, sLBackward,   sLForward,  sLBackward,   sRBackward,  sRForward, sRBackward, sRForward,
	sLCoxaUp,  sLCoxadDown,  sLCoxaUp,   sLCoxadDown,  sRCoxaUp,  sRCoxaDown,  sRCoxaUp,  sRCoxaDown,
	512, 512, 512, 512, 512, 512, 512, 512};

// Place legs down, all legs on ground.
PROGMEM prog_uint16_t SimpleRightTurn2[] = {24,
        sLForward,   sLBackward,   sLForward,    sLBackward,  sRBackward,  sRForward,  sRBackward,  sRForward, 
	sLCoxadDown, sLCoxadDown,  sLCoxadDown,  sLCoxadDown, sRCoxaDown,  sRCoxaDown,  sRCoxaDown, sRCoxaDown,
	512, 512, 512, 512, 512, 512, 512, 512};

// Lift other half, move forward.
PROGMEM prog_uint16_t SimpleRightTurn3[] = {24,
	sLBackward,   sLForward,    sLBackward,  sLForward,  sRForward, sRBackward,  sRForward,  sRBackward,
	sLCoxadDown,  sLCoxaUp,   sLCoxadDown,   sLCoxaUp,   sRCoxaDown,  sRCoxaUp,  sRCoxaDown,  sRCoxaUp, 
	512, 512, 512, 512, 512, 512, 512, 512};

// Place legs down, all legs on ground.
PROGMEM prog_uint16_t SimpleRightTurn4[] = {24,
	sLBackward,   sLForward,    sLBackward,   sLForward,   sRForward,   sRBackward,  sRForward,   sRBackward,
	sLCoxadDown,  sLCoxadDown,  sLCoxadDown,  sLCoxadDown, sRCoxaDown,  sRCoxaDown,  sRCoxaDown,  sRCoxaDown,
	512, 512, 512, 512, 512, 512, 512, 512};

// A simple 4-step left-turn.
PROGMEM prog_uint16_t SimpleLeftTurn1[] = {24,
	sLBackward,   sLForward, sLBackward,   sLForward,  sRForward, sRBackward,  sRForward, sRBackward,
	sLCoxaUp,  sLCoxadDown,  sLCoxaUp,   sLCoxadDown,  sRCoxaUp,  sRCoxaDown,  sRCoxaUp,  sRCoxaDown,
	512, 512, 512, 512, 512, 512, 512, 512};


// Place legs down, all legs on ground.
PROGMEM prog_uint16_t SimpleLeftTurn2[] = {24,
        sLBackward,  sLForward,   sLBackward,   sLForward,    sRForward,   sRBackward,  sRForward,  sRBackward,
	sLCoxadDown, sLCoxadDown,  sLCoxadDown,  sLCoxadDown, sRCoxaDown,  sRCoxaDown,  sRCoxaDown, sRCoxaDown,
	512, 512, 512, 512, 512, 512, 512, 512};

// Lift other half, move forward.
PROGMEM prog_uint16_t SimpleLeftTurn3[] = {24,
	sLForward,  sLBackward,   sLForward,    sLBackward,  sRBackward,  sRForward, sRBackward,  sRForward,
	sLCoxadDown,  sLCoxaUp,   sLCoxadDown,   sLCoxaUp,   sRCoxaDown,  sRCoxaUp,  sRCoxaDown,  sRCoxaUp, 
	512, 512, 512, 512, 512, 512, 512, 512};

// Place legs down, all legs on ground.
PROGMEM prog_uint16_t SimpleLeftTurn4[] = {24,
	sLForward,    sLBackward,   sLForward,    sLBackward,   sRBackward,  sRForward,   sRBackward,  sRForward,
	sLCoxadDown,  sLCoxadDown,  sLCoxadDown,  sLCoxadDown, sRCoxaDown,  sRCoxaDown,  sRCoxaDown,  sRCoxaDown,
	512, 512, 512, 512, 512, 512, 512, 512};

#endif
