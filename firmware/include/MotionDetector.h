#ifndef SCOREMASTER_MOTION_DETECTOR_H
#define SCOREMASTER_MOTION_DETECTOR_H

#define SCORE_COOLDOWN 1000 // milliseconds
#define DISTANCE_THRESHOLD 50 // cm
#define MOTION_POLL_PERIOD 1 // milliseconds

#include <SharpDistSensor.h>
#include <MedianFilter.h>

#define SENSOR_PIN A0
#define MEDIAN_FILTER_WINDOW_SIZE 5

class MotionDetector {
public:
    MotionDetector();

    bool Poll(long current_time);

private:
    bool in_front();

    long m_last_score;
    long m_last_motion_poll;

    SharpDistSensor m_sensor;
};

#endif