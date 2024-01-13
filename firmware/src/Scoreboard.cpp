#include "Scoreboard.h"

/* This syntax is dumb, but the esp library has forced my hand */
class ScoreWriteCallbacks : public BLECharacteristicCallbacks
{
public:
    ScoreWriteCallbacks(Scoreboard *scoreboard) 
        : m_scoreboard(scoreboard) { }

    /* Called whenever someone writes to the score characteristic */
    void onWrite(BLECharacteristic *rc) {
        m_scoreboard->UpdateScore(0);
    }

private:
    Scoreboard *m_scoreboard;

}

Scoreboard::Scoreboard(const char *device_name) 
    : m_device_name(device_name), m_server(nullptr),
    m_score_service(nullptr), m_score_characteristic(nullptr),
    m_write_callbacks(nullptr)
{
}

Scoreboard::~Scoreboard()
{
    delete m_write_callbacks;
}

void Scoreboard::InitBLE()
{
    BLEDevice::init(m_device_name);

    m_server = BLEDevice::createServer();
    m_score_service = m_server->createService(SCORE_SU);
    m_score_characteristic = m_score_service->createCharacteristic(
        SCORE_CU,
        BLECharacteristic::PROPERTY_READ |
            BLECharacteristic::PROPERTY_WRITE);

    /* Bad practice for embedded, but esp library has forced my hand */
    m_write_callbacks = new ScoreWriteCallbacks(this);
    m_score_characteristic.setCallbacks(m_write_callbacks);

    m_score_characteristic->setValue(m_score);
    m_score_service->start();

    BLEAdvertising *advertising = BLEDevice::getAdvertising();
    advertising->addServiceUUID(SCORE_SU);
    advertising->setScanResponse(true);
    advertising->setMinPreferred(0x06); // help with iPhone connections
    advertising->setMinPreferred(0x12);
    BLEDevice::startAdvertising();
}

void Scoreboard::UpdateScore(uint32_t score)
{
    m_score = score;
    m_score_characteristic->setValue(score);
}