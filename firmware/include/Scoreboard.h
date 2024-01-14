#ifndef SCOREMASTER_SCOREBOARD_H
#define SCOREMASTER_SCOREBOARD_H

/* Library includes to avoid forward declarations */
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

#include "Display.h"

#define SCORE_SU "77b9bd36-de32-46bf-b340-9276b4c5d237" // service uuid
#define SCORE_CU "361ef854-cd9f-4213-afb3-d7d3a1845f7f" // characteristic uuid

class ScoreWriteCallbacks;

class Scoreboard {
public:
    Scoreboard(const char *device_name);
    ~Scoreboard();

    int GetScore() const { return m_score; }

    void BroadcastScore();
    void UpdateScore(uint32_t data);
    void InitBLE();

private:
    const char *m_device_name;

    BLECharacteristic *m_score_characteristic;
    ScoreWriteCallbacks *m_write_callbacks;

    // Display m_display;
    int m_score;
};

#endif