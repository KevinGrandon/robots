    #include <MicroView.h>

    void setup() {
    uView.begin();
    }

    void loop() {
    uView.print("Hello Kevin.");
    uView.display(); // display current page buffer
    }
