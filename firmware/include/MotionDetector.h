#ifndef SCOREMASTER_MOTION_DETECTOR_H
#define SCOREMASTER_MOTION_DETECTOR_H

#define SCORE_COOLDOWN 1000 // milliseconds
#define DISTANCE_THRESHOLD 50 // cm
#define MOTION_POLL_PERIOD 10 // milliseconds

class MotionDetector {
public:
    MotionDetector();

    bool Poll(long current_time);

private:
    bool in_front() const;

    long m_last_score;
    long m_last_motion_poll;

};

#endif