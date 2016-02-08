var pulse = require('nPulseSensor');
var mraa = require("mraa");
var sensor = new mraa.Aio(0);

pulse.start(
    function(bpm) {
      console.log(bpm);
    },
    function() {
      return sensor.read();
    });
