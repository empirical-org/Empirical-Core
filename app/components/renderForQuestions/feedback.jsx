import React from 'react'
import _ from 'underscore'
import icon from '../../img/question_icon.svg'
import revise from '../../img/revise_icon.svg'
import multiple from '../../img/multiple_choice_icon.svg'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default React.createClass({

  renderFeedback: function () {
    const data = this.props
    const latestAttempt = getLatestAttempt(data.question.attempts)
    const key = data.question.attempts.length;
    if (latestAttempt) {
      if (data.override) {
        return (
          <div className="feedback-row student-feedback-inner-container" key={key}>
            <img className="multiple" src={multiple}/>
            <p>{data.sentence}</p>
          </div>
        )
      } else if (latestAttempt.response.feedback !== undefined) {
        return (
          <div className="feedback-row student-feedback-inner-container" key={key}>
            <img className="revise" src={revise}/>
            {data.renderFeedbackStatements(latestAttempt)}
          </div>
        )
      } else {
        return (
          <div className="feedback-row student-feedback-inner-container" key={key}>
            <img className="revise" src={revise}/>
            <p>{data.sentence}</p>
          </div>
        )
      }
    } else {
      if(!!data.question.instructions) {
        return (
          <div className="feedback-row student-feedback-inner-container" key={key}>
            <img className="info" src={icon}/>
            <p>{data.question.instructions}</p>
          </div>
        )
      }
      else if(data.getQuestion && data.getQuestion().instructions!=="") {
        return (
          <div className="feedback-row student-feedback-inner-container" key={key}>
            <img className="info" src={icon}/>
            <p>{data.getQuestion().instructions}</p>
          </div>
        )
      }
      else if (data.getQuestion && data.getQuestion().cues && data.getQuestion().cues.length > 0 && data.getQuestion().cues[0] !== "") {
        const cues = data.getQuestion().cues.join(', ')
        return (
          <div className="feedback-row student-feedback-inner-container" key={key}>
            <img className="info" src={icon}/>
            <p>Combine the sentences using {data.listCuesAsString(data.getQuestion().cues)}</p>
          </div>
        )
      } else {
        return (
          <div className="feedback-row student-feedback-inner-container" key={key}>
            <img className="info" src={icon}/>
            <p>Combine the sentences into one sentence.</p>
          </div>

        )
      }
    }
  },

  render: function() {
    return (
      <div className="student-feedback-container">
      {/* <ReactCSSTransitionGroup
        transitionName="feedback-carousel"
        transitionEnterTimeout={500}
        > */}
        {this.renderFeedback()}
      {/* </ReactCSSTransitionGroup> */}
      </div>
    )
  }
})

const getLatestAttempt = function (attempts = []) {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex]
}
