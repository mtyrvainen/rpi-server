# rpi-server
rpi-server is hobby project in which a Raspberry Pi is running web server and serving a web page from where you can click some buttons to make some LEDs dance. You can sometimes find it running [here](http://tyrvainen.hopto.org:3001/build).

Please understand that this project is in no way a properly secure, ready-for-business-use, or follows any best practices. It was a learning journey for me and you can see that in the code.

### 1. What do you need?
If you want to run this project for yourself you will need:
* Raspberry Pi (I'm using model 3B, your mileage may vary with other models)
* a camera for the RPi (something like [this](https://www.raspberrypi.org/products/camera-module-v2/)
* a some LEDs and stuff

### 2. Preparing the RPi

##### Enable the camera
Enable the RPi camera by running `raspi-config` (Interfacing --> Enable camera).

##### Install from `apt-get`
You need a bunch of software, most of of which you can install via `apt-get`. Make sure you have:
* git
* python3
* ffmpeg

##### Install Node.js manually
What you shouldn't install the usual way is Node.js. Depending on your RPi model, you need check which ARM version your processor is using (run `uname`), and download the proper Node version from the [official site](https://nodejs.org/en/download/). If you have the same model 3B you should be fine using [this version](https://nodejs.org/dist/v12.16.3/node-v12.16.3-linux-armv7l.tar.xz), but please doublecheck youself.

1. `wget https://nodejs.org/dist/v12.16.3/node-v12.16.3-linux-armv7l.tar.xz`
1. `tar -xf <nodefilename>.tar.xz`
1. `cd node-v6.11.1-linux-armv6l/`
1. `sudo cp -R * /usr/local/`
1. and reboot

Check that everything was installed properly by running `node -v` and `npm -v`.

##### Dynamic DNS?

If you want to have access to your project/site via a nice URL, you'll need some kind of DDNS solution, unless you have a static IP address from your ISP. I used [noip.com](https://www.noip.com/). It's quick to setup, easy to install and free for a few devices. Register an account and then install the client software on RPi.
1. `mkdir /home/pi/noip`
1. `cd /home/pi/noip`
1.	`wget https://www.noip.com/client/linux/noip-duc-linux.tar.gz`
1.	`tar vzxf noip-duc-linux.tar.gz`
1.	`cd noip-2.1.9-1`
1.	`sudo make`
1.	`sudo make install`
    * enter your hostname, username and password
1. `sudo /usr/local/bin/noip2`
1. to check the service is running properly: `sudo noip2 -S`

##### Git Projects
You'll need to clone this repository, the one for the [frontend of this project](https://github.com/mtyrvainen/rpi-front) and for streaming the camera feed, you'll need [JSMpeg](https://github.com/phoboslab/jsmpeg). Run `git clone <repo>` and then `npm install` in each project folder.

Build the rpi-front project (`npm run build`) and copy the `build/` folder under rpi-server folder.

### 3. Running the project
Finally you're ready to run the project.

1. Run the jsmpeg websocket service:
   * `node websocket-relay.js supersecret 8081 8082`
   * choose a password and substitute 'supersecret' with it
1. Start ffmpeg to feed into the jsmpeg service. These parameters worked well for me:
   * `ffmpeg -f v4l2 -framerate 24.8 -video_size 640x480 -i /dev/video0 -f mpegts -codec:v mpeg1video -s 640x480 -b:v 1000k -bf 0 http://localhost:8081/supersecret`
1. start the rpi-server (in dev mode for now):
   * `npm run dev`
1. navigate to your-domain.org:3001/build
