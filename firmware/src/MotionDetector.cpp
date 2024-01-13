#include <Arduino.h>
#include "MotionDetector.h"

MotionDetector::MotionDetector()
{ }

bool MotionDetector::InFront() const
{
    if (last_score - millis() > SCORE_COOLDOWN) {
        /* Check Distance */
    }
    return false;
}