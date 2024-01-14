all: build
build: src/main.cpp
	pio run

upload:
	pio run --target upload

monitor:
	minicom -D /dev/ttyUSB0 -b 115200

clean:
	pio run --target clean
