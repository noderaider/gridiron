window.navigator.getUserMedia = ( window.navigator.getUserMedia ||
                                  window.navigator.webkitGetUserMedia ||
                                  window.navigator.mozGetUserMedia ||
                                  window.navigator.msGetUserMedia
                                )

export const audioCtx = new (window.AudioContext || window.webkitAudioContext)() // define audio context
// Webkit/blink browsers need prefix, Safari won't work without window.


export const analyser = audioCtx.createAnalyser()
export const distortion = audioCtx.createWaveShaper()
export const gainNode = audioCtx.createGain()
export const biquadFilter = audioCtx.createBiquadFilter()

export const makeDistortionCurve = amount => { // function to make curve shape for distortion/wave shaper node to use
  let k = typeof amount === 'number' ? amount : 50
  let n_samples = 44100
  let curve = new Float32Array(n_samples)
  let deg = Math.PI / 180
  let x = null
  for(let i = 0; i < n_samples; ++i) {
    x = i*2/n_samples - 1
    curve[i] = (3+k) * x * 20 * deg / (Math.PI + k*Math.abs(x))
  }
  return curve
}

export const start = ({ voiceSetting, visualSetting, mute, visualizer }) => {

  window.navigator.getUserMedia({ audio: true } // constraints - only audio needed for this app
                                , stream => { // Success callback
                                    let source = audioCtx.createMediaStreamSource(stream)
                                    source.connect(analyser)
                                    analyser.connect(distortion)
                                    distortion.connect(biquadFilter)
                                    biquadFilter.connect(gainNode)
                                    gainNode.connect(audioCtx.destination) // connecting the different audio graph nodes together
                                    visualize(stream, visualSetting)
                                    voiceChange(voiceSetting)
                                  }
                                , err => console.log('The following error occured: ' + err)
                              )
}

var drawVisual = null
export const visualize = (stream, visualSetting) => {
  let WIDTH = canvas.width
  let HEIGHT = canvas.height
  if(visualSetting == 'sinewave') {
    analyser.fftSize = 2048
    let bufferLength = analyser.frequencyBinCount // half the FFT value
    let dataArray = new Uint8Array(bufferLength) // create an array to store the data
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)
    const draw = () => {
      let drawVisual = requestAnimationFrame(draw)
      analyser.getByteTimeDomainData(dataArray) // get waveform data and put it into the array created above
      canvasCtx.fillStyle = 'rgb(200, 200, 200)' // draw wave with canvas
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)
      canvasCtx.lineWidth = 2
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)'
      canvasCtx.beginPath()
      var sliceWidth = WIDTH * 1.0 / bufferLength
      var x = 0
      for(var i = 0; i < bufferLength; i++) {
        var v = dataArray[i] / 128.0
        var y = v * HEIGHT/2
        if(i === 0)
          canvasCtx.moveTo(x, y)
        else
          canvasCtx.lineTo(x, y)
        x += sliceWidth
      }
      canvasCtx.lineTo(canvas.width, canvas.height/2)
      canvasCtx.stroke()
      return drawVisual
    }
    return draw()
  } else if(visualSetting == "off") {
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)
    canvasCtx.fillStyle = "red"
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)
  }
}

export const voiceChange = voiceSetting => {
  distortion.curve = new Float32Array
  biquadFilter.gain.value = 0 // reset the effects each time the voiceChange function is run
  console.log(voiceSetting)
  if(voiceSetting == "distortion")
    distortion.curve = makeDistortionCurve(400) // apply distortion to sound using waveshaper node
  else if(voiceSetting == "biquad") {
    biquadFilter.type = "lowshelf"
    biquadFilter.frequency.value = 1000
    biquadFilter.gain.value = 25 // apply lowshelf filter to sounds using biquad
  } else if(voiceSetting == "off")
    console.log("Voice settings turned off") // do nothing, as off option was chosen
}


mute.onclick = voiceMute

export const voiceMute = () => { // toggle to mute and unmute sound
  if(mute.id === '') {
    gainNode.gain.value = 0 // gain set to 0 to mute sound
    mute.id = "activated"
    mute.innerHTML = "Unmute"
  } else {
    gainNode.gain.value = 1 // gain set to 1 to unmute sound
    mute.id = ""
    mute.innerHTML = "Mute"
  }
}
