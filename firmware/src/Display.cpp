#include "Display.h"

#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <SPI.h>
#include <Wire.h>

#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 32 // OLED display height, in pixels

/* Connected via i2c ports on ESP32 board */
#define OLED_RESET -1       // Reset pin # (or -1 if sharing Arduino reset pin)
#define SCREEN_ADDRESS 0x3C ///< See datasheet for Address; 0x3D for 128x64, 0x3C for 128x32

static Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void init_display()
{
    // SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
    if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
        Serial.println(F("SSD1306 allocation failed"));
    }
    display.clearDisplay();
}

void draw_number(uint32_t number)
{
    Serial.println("Drawing Number");
    Serial.println(number);
    /* split into digits */
    const int digits[] = {number % 10, (number / 10) % 10};
    Serial.print(digits[0]);
    Serial.print(" ");
    Serial.println(digits[1]);

    if (number > 99)
        return;

    display.clearDisplay();

    display.drawChar(0, 0,
                        '0' + digits[1], SSD1306_WHITE, SSD1306_BLACK,
                        4);

    display.drawChar(50, 0,
        '0' + digits[0], SSD1306_WHITE, SSD1306_BLACK,
        4);

    display.display();
}