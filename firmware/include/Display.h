#ifndef SCOREMASTER_DISPLAY_H
#define SCOREMASTER_DISPLAY_H

#include <Arduino.h>

class Display {
public:
    Display();
    void DrawNumber(uint32_t number);
};

#endif
