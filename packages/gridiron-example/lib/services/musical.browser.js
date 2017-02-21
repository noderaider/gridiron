'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

window.navigator.getUserMedia = window.navigator.getUserMedia || window.navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia || window.navigator.msGetUserMedia;

var audioCtx = exports.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // define audio context
// Webkit/blink browsers need prefix, Safari won't work without window.


var analyser = exports.analyser = audioCtx.createAnalyser();
var distortion = exports.distortion = audioCtx.createWaveShaper();
var gainNode = exports.gainNode = audioCtx.createGain();
var biquadFilter = exports.biquadFilter = audioCtx.createBiquadFilter();

var makeDistortionCurve = exports.makeDistortionCurve = function makeDistortionCurve(amount) {
  // function to make curve shape for distortion/wave shaper node to use
  var k = typeof amount === 'number' ? amount : 50;
  var n_samples = 44100;
  var curve = new Float32Array(n_samples);
  var deg = Math.PI / 180;
  var x = null;
  for (var i = 0; i < n_samples; ++i) {
    x = i * 2 / n_samples - 1;
    curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
  }
  return curve;
};

var start = exports.start = function start(_ref) {
  var voiceSetting = _ref.voiceSetting,
      visualSetting = _ref.visualSetting,
      mute = _ref.mute,
      visualizer = _ref.visualizer;


  window.navigator.getUserMedia({ audio: true } // constraints - only audio needed for this app
  , function (stream) {
    // Success callback
    var source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.connect(distortion);
    distortion.connect(biquadFilter);
    biquadFilter.connect(gainNode);
    gainNode.connect(audioCtx.destination); // connecting the different audio graph nodes together
    visualize(stream, visualSetting);
    voiceChange(voiceSetting);
  }, function (err) {
    return console.log('The following error occured: ' + err);
  });
};

var drawVisual = null;
var visualize = exports.visualize = function visualize(stream, visualSetting) {
  var WIDTH = canvas.width;
  var HEIGHT = canvas.height;
  if (visualSetting == 'sinewave') {
    var _ret = function () {
      analyser.fftSize = 2048;
      var bufferLength = analyser.frequencyBinCount; // half the FFT value
      var dataArray = new Uint8Array(bufferLength); // create an array to store the data
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      var draw = function draw() {
        var drawVisual = requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray); // get waveform data and put it into the array created above
        canvasCtx.fillStyle = 'rgb(200, 200, 200)'; // draw wave with canvas
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
        canvasCtx.beginPath();
        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;
        for (var i = 0; i < bufferLength; i++) {
          var v = dataArray[i] / 128.0;
          var y = v * HEIGHT / 2;
          if (i === 0) canvasCtx.moveTo(x, y);else canvasCtx.lineTo(x, y);
          x += sliceWidth;
        }
        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
        return drawVisual;
      };
      return {
        v: draw()
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } else if (visualSetting == "off") {
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.fillStyle = "red";
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
  }
};

var voiceChange = exports.voiceChange = function voiceChange(voiceSetting) {
  distortion.curve = new Float32Array();
  biquadFilter.gain.value = 0; // reset the effects each time the voiceChange function is run
  console.log(voiceSetting);
  if (voiceSetting == "distortion") distortion.curve = makeDistortionCurve(400); // apply distortion to sound using waveshaper node
  else if (voiceSetting == "biquad") {
      biquadFilter.type = "lowshelf";
      biquadFilter.frequency.value = 1000;
      biquadFilter.gain.value = 25; // apply lowshelf filter to sounds using biquad
    } else if (voiceSetting == "off") console.log("Voice settings turned off"); // do nothing, as off option was chosen
};

mute.onclick = voiceMute;

var voiceMute = exports.voiceMute = function voiceMute() {
  // toggle to mute and unmute sound
  if (mute.id === '') {
    gainNode.gain.value = 0; // gain set to 0 to mute sound
    mute.id = "activated";
    mute.innerHTML = "Unmute";
  } else {
    gainNode.gain.value = 1; // gain set to 1 to unmute sound
    mute.id = "";
    mute.innerHTML = "Mute";
  }
};