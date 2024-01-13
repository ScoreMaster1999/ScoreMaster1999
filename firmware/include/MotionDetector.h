#ifndef SCOREMASTER_MOTION_DETECTOR_H
#define SCOREMASTER_MOTION_DETECTOR_H

#define SCORE_COOLDOWN 1000 // milliseconds
#define DISTANCE_THRESHOLD 50 // cm

class MotionDetector {
public:
    MotionDetector();

    bool InFront() const;

private:
    int last_score;

};

#endif