#ifndef SCOREMASTER_DISPLAY_H
#define SCOREMASTER_DISPLAY_H

#include <Arduino.h>

// I would put this in a class but Adafruits library has forced my hand
void init_display();
void draw_number(uint32_t number);

// class Display {
// public:
//     Display();
//     ~Display();

//     void DrawNumber(uint32_t number);

// private:
//     Adafruit_SSD1306 *m_display;

// };

#endif
