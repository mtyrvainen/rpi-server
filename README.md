# rpi-server
rpi-server is hobby project in which a Raspberry Pi is running web server and serving a web page from where you can click some buttons to make some LEDs dance. You can sometimes find it running [here](http://tyrvainen.hopto.org:3001/build).

### 1.What do you need?
If you want to run this project for yourself you will need:
* Raspberry Pi (I'm using model 3B, your mileage may vary with other models)
* a camera for the RPi (something like [this](https://www.raspberrypi.org/products/camera-module-v2/)
* a some LEDs and stuff

### 2.Preparing the RPi
Enable the RPi camera by running `raspi-config` (Interfacing --> Enable camera).

You need a bunch of software, most of of which you can install via `apt-get`. Make sure you have:
* git
* python3
* ffmpeg

What you shouldn't install the usual way is Node.js. Depending on your RPi model, you need check which ARM version your processor is using (run `uname`), and download the proper Node version from the [official site](https://nodejs.org/en/download/). If you have the same model 3B you should be fine using [this version](https://nodejs.org/dist/v12.16.3/node-v12.16.3-linux-armv7l.tar.xz), but please doublecheck youself.
