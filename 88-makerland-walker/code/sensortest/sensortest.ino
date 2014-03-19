#include <DistanceGP2Y0A21YK.h>

DistanceGP2Y0A21YK sensor1;
DistanceGP2Y0A21YK sensor2;

int d1;
int d2;

void setup() {
    sensor1.begin(A1);
    sensor2.begin(A2);
    Serial.begin(9600);
}
void loop() {
    d1 = sensor1.getDistanceCentimeter();
    d2 = sensor2.getDistanceCentimeter();

    Serial.print("\nDistance in centimers: ");
    Serial.print(d1);  
    Serial.print(d2);  
    delay(500);
}
