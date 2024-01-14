#include "Scoreboard.h"
#include "Display.h"

/* This syntax is dumb, but the esp library has forced my hand */
class ScoreWriteCallbacks : public BLECharacteristicCallbacks
{
public:
    ScoreWriteCallbacks(Scoreboard *scoreboard) 
        : m_scoreboard(scoreboard) { }

    /* Called whenever someone writes to the score characteristic */
    void onWrite(BLECharacteristic *rc) {
        uint32_t x = *rc->getData();
        m_scoreboard->UpdateScore(x);
    }

private:
    Scoreboard *m_scoreboard;

};

/* See comment above "class ScoreWriteCallbacks" for more explanation */
class ServerEventCallbacks : public BLEServerCallbacks
{
public:
    void onWrite(BLEServer *s) {
        s->startAdvertising(); // restart advertising
    }

    void onDisconnect(BLEServer *s) {
        s->startAdvertising(); // restart advertising
    }
};

Scoreboard::Scoreboard(const char *device_name) 
    : m_device_name(device_name), m_score_characteristic(nullptr),
    m_write_callbacks(nullptr)
{
}

Scoreboard::~Scoreboard()
{
    delete m_score_characteristic;
}

void Scoreboard::InitBLE()
{
    BLEDevice::init(m_device_name);

    BLEServer *server = BLEDevice::createServer();
    server->setCallbacks(new ServerEventCallbacks());

    BLEService *service = server->createService(SCORE_SU);
    m_score_characteristic = service->createCharacteristic(
        SCORE_CU,
        BLECharacteristic::PROPERTY_READ |
            BLECharacteristic::PROPERTY_WRITE |
            // BLECharacteristic::PROPERTY_INDICATE);
            BLECharacteristic::PROPERTY_NOTIFY);

    /* Bad practice for embedded, but esp library has forced my hand */
    m_write_callbacks = new ScoreWriteCallbacks(this);
    m_score_characteristic->setCallbacks(m_write_callbacks);
    m_score_characteristic->setValue(m_score);

    m_score_characteristic->addDescriptor(
        new BLEDescriptor((uint16_t) 0x2902)
    );

    service->start();

    BLEAdvertising *advertising = BLEDevice::getAdvertising();
    advertising->addServiceUUID(SCORE_SU);
    advertising->setScanResponse(true);
    advertising->setMinPreferred(0x06); // help with iPhone connections
    advertising->setMinPreferred(0x12);
    BLEDevice::startAdvertising();
}

void Scoreboard::BroadcastScore()
{
    m_score_characteristic->setValue(m_score);
    m_score_characteristic->notify();
}

void Scoreboard::UpdateScore(uint32_t score)
{
    m_score = score;

    /* Update display */
    // m_display.DrawNumber(m_score);
    draw_number(score);
}