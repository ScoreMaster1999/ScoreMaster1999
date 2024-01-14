#include "MotionDetector.h"
#include <Arduino.h>

MotionDetector::MotionDetector()
    : m_last_motion_poll(0), m_last_score(0),
    m_sensor(SENSOR_PIN, MEDIAN_FILTER_WINDOW_SIZE)
{ 
    m_sensor.setModel(SharpDistSensor::GP2Y0A60SZLF_5V);
}

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

bool MotionDetector::in_front()
{
    return m_sensor.getDist() >= 100;
}