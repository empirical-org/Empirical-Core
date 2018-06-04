// POTENTIALLY NOT USED ANYMORE

import React from 'react'
import Question from '../../libs/question'
import _ from 'underscore'
var C = require("../../constants").default

const feedbackStrings = C.FEEDBACK_STRINGS

export default React.createClass({
  getInitialState: function () {
    return {editing: false}
  },

  renderSentenceFragments: function () {
    return this.props.question.sentences.map((sentence, index) => {
      return (<li key={index}>{sentence}</li>)
    })
  },

  renderFeedback: function () {
    const latestAttempt = getLatestAttempt(this.props.question.attempts)
    if (latestAttempt) {
      if (latestAttempt.found) {
        return <ul>{this.renderFeedbackStatements(latestAttempt)}</ul>
      } else {
        return (
          <p>We have not seen this sentence before. Could you please try writing it in another way?</p>
        )
      }
    }
  },

  getErrorsForAttempt: function (attempt) {
    return _.pick(attempt, ...(C.ERROR_TYPES))
  },

  renderFeedbackStatements: function (attempt) {
    const errors = this.getErrorsForAttempt(attempt);
    // add keys for react list elements

    var components = [(<li key="feedback">{attempt.response.feedback}</li>)]
    var errorComponents = _.values(_.mapObject(errors, (val, key) => {
      if (val) {
        return (<li key={key}>{feedbackStrings[key]}</li>)
      }
    }))
    return components.concat(errorComponents)
  },

  checkAnswer: function () {
    var question = new Question(this.props.question);
    var response = question.checkMatch(this.refs.response.value);
    this.props.submitResponse(response)
    this.setState({editing: false})
  },

  toggleDisabled: function () {
    if (this.state.editing) {
      return "";
    }
    return "is-disabled"
  },

  handleChange: function () {
    this.setState({editing: true})
  },

  readyForNext: function () {
    if (this.props.question.attempts.length > 0 ) {
      var latestAttempt = getLatestAttempt(this.props.question.attempts)
      if (latestAttempt.found) {


        var errors = _.keys(this.getErrorsForAttempt(latestAttempt))
        if (latestAttempt.response.status === 'optimal' && errors.length === 0) {
          return true
        }

      }

    }
    return false
  },

  renderNextQuestionButton:  function () {
    if (this.readyForNext()) {
      return (<button className="button is-outlined is-success" onClick={console.log("next")}>Next</button>)
    }
  },

  render: function () {
    return (
      <div className="content">
        <h4>{this.props.question.prompt}</h4>
        <ul>
          {this.renderSentenceFragments()}
        </ul>
        {this.renderFeedback()}
        <div className="control">
          <textarea className="textarea" ref="response" placeholder="Textarea" onChange={this.handleChange}></textarea>
        </div>
        <div className="button-group">
          <button className={"button is-outlined is-primary " + this.toggleDisabled()} onClick={this.checkAnswer}>Check Your Answer</button>
          {this.renderNextQuestionButton()}
        </div>
      </div>

    )
  }
})

const getLatestAttempt = function (attempts = []) {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex]
}
