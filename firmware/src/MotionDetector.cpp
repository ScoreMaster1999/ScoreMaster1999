#include "MotionDetector.h"
#include <Arduino.h>

MotionDetector::MotionDetector()
    : m_last_motion_poll(0), m_last_score(0)
{ }

// Returns true if ball just scored and score cooldown is finished
bool MotionDetector::Poll(long current_time)
{
    if (current_time - m_last_motion_poll > MOTION_POLL_PERIOD) {
        if (in_front() && current_time - m_last_score > SCORE_COOLDOWN) {
            m_last_score = current_time;
            return true;
        }

        m_last_motion_poll = current_time; // update counter
    }

    return false;
}

bool MotionDetector::in_front() const
{
    return true;
}