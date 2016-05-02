# node-red-contrib-piface-digital

<a href="http://nodered.org" target="_new">Node-RED</a> nodes to control a
<a href="http://www.piface.org.uk/products/piface_digital/" target="_new">PiFace Digital</a>
add-on board for a Raspberry-Pi using the node implementation <a href="https://github.com/tualo/node-pifacedigital" target="_new">node-pifacedigital</a>.

**Note:** Some later versions of the PiFace relabelled the switch inputs to be `0 - 7`
instead of `1 - 8` as on the original boards.
We cannot automatically detect this so the user will have to apply some common sense.



## Pre-reqs

Please install all prequisites for <a href="https://github.com/tualo/node-pifacedigital" target="_new">node-pifacedigital</a> before you install this node:
Please consider that the current Version <a href="https://github.com/tualo/node-pifacedigital" target="_new">node-pifacedigital</a> on github only supports node.js >=4.x.x. The Version on npmjs.com is outdated. For that reason, it will be installed directly vom gitbub.

On a fresh Raspbian installation you should enable SPI. Therefor start `raspi-config` and
enable SPI under "Advanced Options".

After rebooting you should add your user to the SPI-Group, e.g. for user pi:
```
usermod -a -G spi pi
```

#### Install necessary libraries

```
git clone https://github.com/piface/libmcp23s17.git
cd libmcp23s17/
make
sudo make install
```

```
git clone https://github.com/piface/libpifacedigital.git
cd libpifacedigital/
make
sudo make install
```

## Install

Run the following command in your Node-RED user directory - typically `~/.node-red` or `/opt/iobroker/node_modules/iobroker.node-red´on a iobroker installation.

    npm install node-red-contrib-piface-digital


## Usage

A pair of input and output Node-RED nodes for the Raspberry Pi PiFace Digital
add-on board.

### Output

The PiFace output node will set the selected pin on or off
depending on the value passed in. Expects a `msg.payload` with either a
1 or 0 (or true or false).


### Input

The PiFace input node generates a `msg.payload` with either a 0 or 1
depending on the state of the input pin.

The `msg.topic` is set to <i>piface/{the pin number}</i>
