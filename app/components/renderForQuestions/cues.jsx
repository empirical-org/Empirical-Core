import React from 'react'
import _ from 'underscore'
import arrow from '../../img/arrow_icon.svg'

export default React.createClass({
  renderExplanation: function () {
    let text = "joining words"
    if (this.props.getQuestion().cues && this.props.getQuestion().cues.length === 1) {
      text = "joining word"
    }
    return (
      <div className="cue-explanation" key="explanation">
      {text}
      </div>
    )
  },

  renderCues: function () {
    if (this.props.getQuestion().cues && this.props.getQuestion().cues.length > 0 && this.props.getQuestion().cues[0] !== "") {
      const cueDivs = this.props.getQuestion().cues.map((cue) => {
        return (
          <div key={cue} className="cue">
            {cue}
          </div>
        )
      })
      return (
        <div className="cues">
          {cueDivs}
          <img src={arrow}/>
          {this.renderExplanation()}
        </div>
      )
    }
  },

  render: function() {
    return <div>{this.renderCues()}</div>
  }

})
