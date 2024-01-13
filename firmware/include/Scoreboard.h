#ifndef SCOREMASTER_SCOREBOARD_H
#define SCOREMASTER_SCOREBOARD_H

/* Library includes to avoid forward declarations */
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

#define SCORE_SU "77b9bd36-de32-46bf-b340-9276b4c5d237" // service uuid
#define SCORE_CU "361ef854-cd9f-4213-afb3-d7d3a1845f7f" // characteristic uuid

class Scoreboard {
public:
    Scoreboard(const char *device_name);

    int GetScore() const { return m_score; }
    void InitBLE();

private:
    void UpdateScore(uint32_t data); // callback

    const char *m_device_name;

    BLEServer *m_server;
    BLEService *m_score_service;
    BLECharacteristic *m_score_characteristic;

    int m_score;
};

#endif