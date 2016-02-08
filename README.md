# nPulseSensor
[![NPM](https://nodei.co/npm/nPulseSensor.js.png)](https://nodei.co/npm/nPulseSensor.js/)

BPM calculation module for the Node.js  
  
This is library is for [PulseSensor](http://pulsesensor.com/). 
You can specify how to read an analog value from the sensor, so you can use Intel Edison and Raspberry Pi, such as the self-made device.

## Installation
```
npm install nPulseSensor
```

## Usage

```
var pulse = require('nPulseSensor');

pulse.start(bpm_callback(bpm), read_function())
```

- __bpm_callback__  
Emitted when the BPM caluclated.
- __read_function__  
Return value from the sensor in this function.

## Example

mraa.Aio

```
var pulse = require('nPulseSensor');
var mraa = require('mraa');
var sensor = new mraa.Aio(0);

pulse.start(
    function(bpm) {
      console.log(bpm);
    },
    function() {
      return sensor.read();
    });
```

mraa.I2c with MCP3425

```
var pulse = require('nPulseSensor');
var mraa = require('mraa');
var sensor = new mraa.I2c(0);
sensor.address(0x68);
sensor.writeReg(0x00, 0x80);

var readi2c = function () {
  var rdy = 1;
  var buf = new Buffer(3);
  while(rdy){
    buf = beats.read(3);
    rdy = (buf[2] & 0x80) >>> 7;
  }
  buf[0] = buf[0] & 0x0f;
  return buf[0] * 0xff + buf[1];
}

pulse.start(function(bpm){console.log(bpm);}, readi2c);
```

## Licensing
This library is released under the MIT License, see LICENSE.
