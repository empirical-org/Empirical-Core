import React from 'react'
import _ from 'underscore'

export default React.createClass({

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
        </div>
      )
    }
  },

  render: function() {
    return <div>{this.renderCues()}</div>
  }

})
