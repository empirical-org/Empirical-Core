import React from 'react'
import Question from '../../libs/question'

export default React.createClass({
  getInitialState: function () {
    return {feedback: false}
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
        return (
          <p>{latestAttempt.response.feedback}</p>
        )
      } else {
        return (
          <p> This is not a valid sentence </p>
        )
      }
    }
  },

  checkAnswer: function () {
    var question = new Question(this.props.question);
    var response = question.checkMatch(this.refs.response.value);
    this.props.submitResponse(response)
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
          <textarea className="textarea" ref="response" placeholder="Textarea"></textarea>
        </div>
        <p className="control">
          <button className="button is-primary" onClick={this.checkAnswer}>Check answer</button>
        </p>
      </div>

    )
  }
})

const getLatestAttempt = function (attempts = []) {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex]
}
