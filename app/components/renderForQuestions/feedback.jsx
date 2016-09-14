import React from 'react'
import _ from 'underscore'
import icon from '../../img/question_icon.svg'

export default React.createClass({

  renderFeedback: function () {
    const data = this.props
    const latestAttempt = getLatestAttempt(data.question.attempts)
    if (latestAttempt) {
      if (latestAttempt.found && latestAttempt.response.feedback !== undefined) {
        return <ul className="is-unstyled">{data.renderFeedbackStatements(latestAttempt)}</ul>
      } else {
        return (
          <div className="feedback-row">
            <img src={icon}/>
            <p>{data.sentence}</p>
          </div>
        )
      }
    } else {
      if(!!data.question.instructions) {
        return (
          <div className="feedback-row">
            <img src={icon}/>
            <p>{data.question.instructions}</p>
          </div>
        )
      }
      else if(data.getQuestion && data.getQuestion().instructions!=="") {
        return (
          <div className="feedback-row">
            <img src={icon}/>
            <p>{data.getQuestion().instructions}</p>
          </div>
        )
      }
      else if (data.getQuestion && data.getQuestion().cues && data.getQuestion().cues.length > 0 && data.getQuestion().cues[0] !== "") {
        const cues = data.getQuestion().cues.join(', ')
        return (
          <div className="feedback-row">
            <img src={icon}/>
            <p>Combine the sentences using {data.listCuesAsString(data.getQuestion().cues)}</p>
          </div>
        )
      } else {
        return (
          <div className="feedback-row">
            <img src={icon}/>
            <p>Combine the sentences into one sentence.</p>
          </div>

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
