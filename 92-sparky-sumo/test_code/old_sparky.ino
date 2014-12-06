Servo leftServo;
Servo rightServo;

void setup() {
    Spark.function("servowrite", servowrite);
    leftServo.attach(A0);
    rightServo.attach(A1);
}

void loop() {

}

int servowrite(String command)
{
        //convert ascii to integer
        int pinNumber = command.charAt(1) - '0';
        //Sanity check to see if the pin numbers are within limits
        if (pinNumber< 0 || pinNumber >7) return -1;

        String value = command.substring(3);

        if(command.startsWith("A0"))
        {
            leftServo.write(value.toInt());
            return 1;
        }
        else if(command.startsWith("A1"))
        {
            rightServo.write(value.toInt());
            return 1;
        }
        else return -1;
}
