These Python scripts are a part of the rpi-server
project (https://github.com/mtyrvainen/rpi-server/).

To start the service run start_led_service.py.

These have only been run and tested on Python 3, 
no guarantees it will run on any Python 2.x versions.

The colors-to-GPIO-pins connections in the code are now:

  red = LED(23) [= pin number 16]
  green = LED(18) [= pin number 12]
  blue = LED(24) [= pin number 18]

as per the GPIO Zero project
(https://gpiozero.readthedocs.io/en/stable/recipes.html#pin-numbering).
