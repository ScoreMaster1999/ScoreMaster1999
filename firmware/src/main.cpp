#include <Arduino.h>

void setup() {
  // No need to initialize the RGB LED
  pinMode(2, OUTPUT);
}

// the loop function runs over and over again forever
void loop() {
  digitalWrite(2, HIGH);   // Turn the RGB LED white
  delay(200);
  digitalWrite(2, LOW);    // Turn the RGB LED off
  delay(200);
}
