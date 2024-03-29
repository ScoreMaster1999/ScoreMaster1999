#include <Arduino.h>
#include "Scoreboard.h"
#include "MotionDetector.h"
#include "Display.h"

/* Constants */
#define DEBUG_LED 2

/* Statics */
Scoreboard scoreboard("ScoreMaster1999_2");
MotionDetector motion_detector;

void setup()
{
    Serial.begin(115200);
    scoreboard.InitBLE();
    pinMode(DEBUG_LED, OUTPUT);

    init_display();
}

void loop()
{
    digitalWrite(DEBUG_LED, HIGH);

    long current_time = millis();

    /* Checks if ball is in front */
    if (motion_detector.Poll(current_time)) {
        scoreboard.UpdateScore(scoreboard.GetScore() + 1);
        scoreboard.BroadcastScore();
    }
}