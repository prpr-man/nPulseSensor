var nPulseSensor = (function() {
  // properties
  var rate = new Array(10);
  var sampleCounter = 0;
  var lastBeatTime = 0;
  var P = 512;
  var T = 512;
  var thresh = 512;
  var amp = 100;
  var firstBeat = true;
  var secondBeat = false;
  var IBI = 600;
  var BPM = 0;
  var Pulse = false;
  var QS = false;

  // function
  var bpmCallback = null;
  var readFunction = null;

  // start calculation
  var start = function(bpm_callback, read_function) {
    bpmCallback = bpm_callback;
    readFunction = read_function;
    lastBeatTime = Date.now();
    update();
  };

  // update every 2ms
  var update = function() {
    var data = readFunction();
    calcBeats(data);
    if(QS){
      bpmCallback(Math.round(BPM));
      QS = false;
    }

    setTimeout(update, 2);
  };

  // See https://github.com/WorldFamousElectronics/PulseSensor_Amped_Arduino
  var calcBeats = function(data) {
    var Signal = data;
   
    sampleCounter = Date.now();
    var N = sampleCounter - lastBeatTime;

    if(Signal < thresh && N > (IBI/5)*3){
      if (Signal < T){
        T = Signal;
      }
    }

    if(Signal > thresh && Signal > P){
      P = Signal;
    }

    if (N > 250){
      if ( (Signal > thresh) && (Pulse === false) && (N > (IBI/5)*3) ){
        Pulse = true;
        IBI = sampleCounter - lastBeatTime;
        lastBeatTime = sampleCounter;

        if(secondBeat){
          secondBeat = false;
          for(var i=0; i<=9; i++){
            rate[i] = IBI;
          }
        }

        if(firstBeat){
          firstBeat = false;
          secondBeat = true;
          return;
        }

        var runningTotal = 0;
        for(var i=0; i<=8; i++){
          rate[i] = rate[i+1];
          runningTotal += rate[i];
        }

        rate[9] = IBI;
        runningTotal += rate[9];
        runningTotal /= 10;
        BPM = 60000/runningTotal;
        QS = true;
      }
    }

    if (Signal < thresh && Pulse === true){
      Pulse = false;
      amp = P - T;
      thresh = amp/2 + T;
      P = thresh;
      T = thresh;
    }

    if (N > 2500){
      thresh = 512;
      P = 512;
      T = 512;
      lastBeatTime = sampleCounter;
      firstBeat = true;
      secondBeat = false;
    }
  };

  return {
    start: start
  };
  
})();

module.exports = PulseSensor;

