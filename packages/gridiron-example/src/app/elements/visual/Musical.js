import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { IS_BROWSER } from 'config'
import { start, visualize, voiceChange } from 'lib/services/musical'


class Musical extends Component {
  componentDidMount() {

    visualSelect.onchange = () => {
      if(IS_BROWSER) window.cancelAnimationFrame(drawVisual)
      visualize(stream)
    }
    voiceSelect.onchange = () => voiceChange()
    start({ voiceSetting: this.voice.value
          , visualSetting: this.visual.value
          , mute: this.mute
          , visualizer: this.visualizer
          })
  }
  render() {
    return (
      <div id="musical">
        <header>
          <h1>Voice-change-O-matic</h1>
        </header>
        <canvas className="visualizer" width="640" height="100" ref={x => this.visualizer=x}></canvas>
        <form className="controls">
          <div>
            <label for="voice">Voice setting</label>
            <select id="voice" name="voice" ref={x => this.voice=x} onChange={e => voiceChange(e.target.value)}>
              <option value="distortion">Distortion</option>
              <option value="convolver">Reverb</option>
              <option value="biquad">Bass Boost</option>
              <option value="off" selected>Off</option>
            </select>
          </div>
          <div>
            <label for="visual">Visualizer setting</label>
            <select
                id="visual"
                name="visual"
                ref={x => this.visual=x}
                onChange={e => {
                  if(this.drawVisual)
                    window.cancelAnimationFrame(this.drawVisual)
                  visualize(this.stream)
                }}>
              <option value="sinewave">Sinewave</option>
              <option value="frequencybars" selected>Frequency bars</option>
              <option value="off">Off</option>
            </select>
          </div>
          <div>
            <a className="mute" ref={x => this.mute=x}>Mute</a>
          </div>
        </form>
        <label for="toggle">❔</label>
        <input type="checkbox" id="toggle"/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {} = state
  return  {}
}

export default connect(mapStateToProps)(Musical)
