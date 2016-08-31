import React from 'react'
import _ from 'underscore'

export default React.createClass({

  renderFeedback: function () {
    const data = this.props
    const latestAttempt = getLatestAttempt(data.question.attempts)
    if (latestAttempt) {
      if (latestAttempt.found && latestAttempt.response.feedback !== undefined) {
        return <ul className="is-unstyled">{data.renderFeedbackStatements(latestAttempt)}</ul>
      } else {
        return (
          <h5 className="title is-5">{data.sentence}</h5>
        )
      }
    } else {
      if(!!data.question.instructions) {
        return (
          <h5 className="title is-5">{data.question.instructions}</h5>
        )
      }
      else if(data.getQuestion && data.getQuestion().instructions!=="") {
        return (
          <h5 className="title is-5">{data.getQuestion().instructions}</h5>
        )
      }
      else if (data.getQuestion && data.getQuestion().cues && data.getQuestion().cues.length > 0 && data.getQuestion().cues[0] !== "") {
        const cues = data.getQuestion().cues.join(', ')
        return (
          <h5 className="title is-5">Combine the sentences using {data.listCuesAsString(data.getQuestion().cues)}</h5>
        )
      } else {
        return (
          <h5 className="title is-5">Combine the sentences into one sentence.</h5>
        )
      }
    }
  },

  render: function() {
    return this.renderFeedback()
  }
})

const getLatestAttempt = function (attempts = []) {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex]
}
