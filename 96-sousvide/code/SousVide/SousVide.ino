
#include <SPI.h>

#include "LiquidCrystal2.h"
#include "OneWire.h"
#include "DallasTemperature.h"

// Data wire is plugged into pin 2 on the Arduino
#define ONE_WIRE_BUS 3
#define LED_PIN 13
#define HEATER_PIN 4
#define UP_PIN 5
#define DOWN_PIN 6

int downCounter = 0;
int upCounter = 0;

unsigned long tempMillis = 0;
unsigned long buttonMillis = 0;
unsigned long outputMillis = 0;

// Setup a oneWire instance to communicate with any OneWire devices (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);

// Pass our oneWire reference to Dallas Temperature. 
DallasTemperature sensors(&oneWire);

LiquidCrystal lcd(7, 8, 9, 10, 11, 12);
float goalFahrenheit = 40;
float currentFahrenheit = 40;


void setup(void)
{
  lcd.begin(20, 4);
  lcd.print("Initializing...");
  
  // start serial port
  //Serial.begin(9600);

  // Start up the library
  sensors.begin(); // IC Default 9 bit. If you have troubles consider upping it 12. Ups the delay giving the IC more time to process the temperature measurement

  pinMode(LED_PIN, OUTPUT);
  pinMode(HEATER_PIN, OUTPUT);
  digitalWrite(HEATER_PIN, HIGH);
}

boolean isButtonRecent() {
 return millis() - buttonMillis < 1000; 
}

int getDegrees(float degrees) {
  return int(degrees);
}

int getDegreesDecimal(float degrees) {
  return int(int(degrees * 10) % 10);
}

boolean isDepressed(int pin) {
 return digitalRead(pin) == HIGH;
}

void updateGoal(float delta) {
  if (delta == 0) return;
  goalFahrenheit += delta;
}

boolean checkButtons() {
  unsigned long currentMillis = millis();
  if (currentMillis - buttonMillis < 150) return false;
  
  boolean hasChanged = false;
  float delta = 0;
  if (isDepressed(DOWN_PIN)) {
    downCounter++;
    delta += (downCounter >= 20 ? 1 : 0.1);
    hasChanged = true;
  } else if (downCounter > 0) {
    downCounter = 0;
    hasChanged = true;
  }
  
  if (isDepressed(UP_PIN)) {
    upCounter++;
    delta -= (upCounter >= 20 ? 1 : 0.1);
    hasChanged = true;
    
  } else if (upCounter > 0)  {
    upCounter = 0;
    hasChanged = true;
  }
  if (hasChanged) buttonMillis = currentMillis;
  
  updateGoal(delta);
  return true;
}

boolean checkTemperature() {
  if (tempMillis != 0 && isButtonRecent()) return false;
  unsigned long currentMillis = millis();
  if (currentMillis - tempMillis < 3000) return false;
  
  float celsius, fahrenheit;
  
  sensors.requestTemperatures();
  celsius = sensors.getTempCByIndex(0);
  fahrenheit = celsius * 1.8 + 32.0;
  currentFahrenheit = fahrenheit;
  
  if (!tempMillis) lcd.clear();
  tempMillis = currentMillis;
  
  return true;
}

void updateOutputs() {
  if (!tempMillis) return;
  unsigned long currentMillis = millis();
  if (currentMillis - outputMillis < 100) return;
  outputMillis = currentMillis;
  
  float marginOfError = 1;
  int goalDegrees = getDegrees(goalFahrenheit);
  int goalDecimal = getDegreesDecimal(goalFahrenheit);
  int currentDegrees = getDegrees(currentFahrenheit);
  int currentDecimal = getDegreesDecimal(currentFahrenheit);
  
  if (abs(goalFahrenheit - currentFahrenheit) < marginOfError) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }

  // HIGH/LOW reversed for relay
  // HIGH - Relay is switched off
  // LOW - Relay is switched off
  if (goalFahrenheit > currentFahrenheit) {
    digitalWrite(HEATER_PIN, LOW);
  } else {
    digitalWrite(HEATER_PIN, HIGH);
  }  
  
  //lcd.clear();
  
  lcd.setCursor(0, 0);
  lcd.print("Goal: ");
  lcd.print(goalDegrees);
  lcd.print(".");
  lcd.print(goalDecimal);
  lcd.print("F  ");
  
  lcd.setCursor(0, 1);
  lcd.print("Current: ");
  lcd.print(currentDegrees);
  lcd.print(".");
  lcd.print(currentDecimal);
  lcd.print("F  ");
}

void loop(void)
{ 
  boolean hasChanged = checkButtons();
  hasChanged = checkTemperature() || hasChanged;
  if (hasChanged || millis() - outputMillis > 1000) {
    updateOutputs();
  }
  delay(10);
}

