#include <Arduino.h>
#include "Scoreboard.h"

/* Constants */
#define DEBUG_LED 2
#define MOTION_POLL_PERIOD 10 // milliseconds

/* Statics */
Scoreboard scoreboard("ScoreMaster1999");
MotionDetector motion_detector;

long last_motion_poll = 0;

void setup()
{
    Serial.begin(115200);
    scoreboard.InitBLE();
    pinMode(DEBUG_LED, OUTPUT);
}

void loop()
{
    digitalWrite(DEBUG_LED, HIGH);

    long current_time = millis();

    /* Poll Timer */
    if (current_time - last_motion_poll > MOTION_POLL_PERIOD) {
        if (motion_detector.InFront())
            scoreboard.BroadcastScoreEvent();
    }

    /* Check for scoring */
    /* Listen for sync upates */
}