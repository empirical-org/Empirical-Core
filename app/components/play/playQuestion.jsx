import React from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router'
import Question from '../../libs/question'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import {submitResponse, clearResponses} from '../../actions.js'
import questionActions from '../../actions/questions'
import pathwayActions from '../../actions/pathways'
var C = require("../../constants").default,
  Firebase = require("firebase")
const sessionsRef = new Firebase(C.FIREBASE).child('sessions')

const feedbackStrings = {
  punctuationError: "punctuation error",
  typingError: "spelling mistake",
  caseError: "capitalization error"
}

const playQuestion = React.createClass({
  getInitialState: function () {
    return {
      editing: false
    }
  },

  componentDidMount: function() {
    this.props.dispatch(clearResponses())
    const {questionID} = this.props.params
    var sessionRef = sessionsRef.push({questionID}, (error) => {
      this.setState({sessionKey: sessionRef.key()})
    })
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.question.attempts.length > 0) {
      var sessionRef = sessionsRef.child(this.state.sessionKey + '/attempts').set(nextProps.question.attempts, (error) => {
        return
      })
    }
  },

  getQuestion: function () {
    const {data} = this.props.questions, {questionID} = this.props.params;
    return (data[questionID])
  },

  submitResponse: function(response) {
    const action = submitResponse(response);
    this.props.dispatch(action);
    var sessionRef = sessionsRef.child(this.state.sessionKey + '/attempts').set(this.props.question.attempts, (error) => {
      return
    })
  },

  renderSentenceFragments: function () {
    return (
      <h4 className="title is-4">{this.getQuestion().prompt}</h4>
    )
    // return this.props.question.sentences.map((sentence, index) => {
    //   return (<li key={index}>{sentence}</li>)
    // })
  },

  renderFeedback: function () {
    const latestAttempt = getLatestAttempt(this.props.question.attempts)
    if (latestAttempt) {
      if (latestAttempt.found && latestAttempt.response.feedback !== undefined) {
        return <ul className="is-unstyled">{this.renderFeedbackStatements(latestAttempt)}</ul>
      } else {
        return (
          <h5 className="title is-5">Try Again. What’s another way you could write this sentence?</h5>
        )
      }
    }
  },

  getErrorsForAttempt: function (attempt) {
    return _.pick(attempt, 'typingError', 'caseError', 'punctuationError')
  },

  generateFeedbackString: function (attempt) {
    const errors = this.getErrorsForAttempt(attempt);
    // add keys for react list elements
    var errorComponents = _.values(_.mapObject(errors, (val, key) => {
      if (val) {
        return "You have made a " + feedbackStrings[key] + "."
      }
    }))
    return errorComponents[0]
  },

  renderFeedbackStatements: function (attempt) {
    const errors = this.getErrorsForAttempt(attempt);
    console.log(_.isEmpty(errors), (attempt.response.optimal !== true))
    // add keys for react list elements
    var components = []
    if (_.isEmpty(errors) && (attempt.response.optimal !== true)) {
      components = components.concat([(<li key="feedback"><h5 className="title is-5">{attempt.response.feedback}</h5></li>)])
    }
    var errorComponents = _.values(_.mapObject(errors, (val, key) => {
      if (val) {
        return (<li key={key}><h5 className="title is-5">Warning: You have made a {feedbackStrings[key]}.</h5></li>)
      }
    }))
    // console.log("parent response check: ", attempt.response.parentID, (this.getQuestion().responses[attempt.response.parentID].optimal !== true), this.getQuestion().responses[attempt.response.parentID].optimal)
    if (attempt.response.parentID && (this.getQuestion().responses[attempt.response.parentID].optimal !== true )) {
      const parentResponse = this.getQuestion().responses[attempt.response.parentID]
      console.log(parentResponse)
      components = [(<li key="parentfeedback"><h5 className="title is-5">{parentResponse.feedback}</h5></li>)].concat(components)
      console.log("comps, ", components)
    }
    return components.concat(errorComponents)
  },

  updateResponseResource: function (response) {
    var previousAttempt;
    const responses = hashToCollection(this.getQuestion().responses);
    const preAtt = getLatestAttempt(this.props.question.attempts)
    if (preAtt) {previousAttempt = _.find(responses, {text: getLatestAttempt(this.props.question.attempts).submitted}) }
    const prid = previousAttempt ? previousAttempt.key : undefined
    console.log('Response: ', response)
    if (response.found) {

      // var latestAttempt = getLatestAttempt(this.props.question.attempts)
      var errors = _.keys(this.getErrorsForAttempt(response))
      if (errors.length === 0) {
        this.props.dispatch(
          questionActions.incrementResponseCount(this.props.params.questionID, response.response.key, prid)
        )
      } else {
        var newErrorResp = {
          text: response.submitted,
          count: 1,
          parentID: response.response.key,
          feedback: this.generateFeedbackString(response)
        }
        this.props.dispatch(
          questionActions.submitNewResponse(this.props.params.questionID, newErrorResp, prid)
        )
      }
    } else {
      var newResp = {
        text: response.submitted,
        count: 1
      }
      this.props.dispatch(
        questionActions.submitNewResponse(this.props.params.questionID, newResp, prid)
      )
    }
  },

  submitPathway: function (response) {
    var data = {};
    var previousAttempt;
    const responses = hashToCollection(this.getQuestion().responses);
    const preAtt = getLatestAttempt(this.props.question.attempts)
    if (preAtt) {previousAttempt = _.find(responses, {text: getLatestAttempt(this.props.question.attempts).submitted}) }
    const newAttempt = _.find(responses, {text: response.submitted})
    console.log("previous attempt: ", previousAttempt)
    console.log("new attempt: ", newAttempt)

    if (previousAttempt) {
      data.fromResponseID = previousAttempt.key
    }
    if (newAttempt) {
      data.toResponseID = newAttempt.key
      data.questionID = this.props.params.questionID
      this.props.dispatch(pathwayActions.submitNewPathway(data))
    }
  },

  checkAnswer: function () {
    var fields = {
      prompt: this.getQuestion().prompt,
      responses: hashToCollection(this.getQuestion().responses)
    }
    var question = new Question(fields);
    var response = question.checkMatch(this.refs.response.value);
    this.updateResponseResource(response)
    this.submitResponse(response)
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
        if (latestAttempt.response.optimal && errors.length === 0) {
          return true
        }
      }
    }
    return false
  },

  getProgressPercent: function () {
    return this.props.question.attempts.length / 3 * 100
  },

  renderNextQuestionButton:  function () {
    if (this.readyForNext()) {
      return (<button className="button is-outlined is-success" onClick={console.log("next")}>Next</button>)
    }
  },

  render: function () {
    const {data} = this.props.questions, {questionID} = this.props.params;
    if (data[questionID]) {
      if (this.props.question.attempts.length > 2 ) {
        return (
          <section className="section">
            <div className="container">
              <div className="content">
                <h4>You completed all of the attempts.</h4>
                <p>Thank you for alpha testing Quill Connect, an open source tool that helps students become better writers.</p>
                <p><Link to={'/play'} className="button is-primary is-outlined">Try Another Question</Link></p>
                <p><strong>Unique code:</strong> {this.state.sessionKey}</p>
              </div>
            </div>
          </section>
        )
      } else if (this.props.question.attempts.length > 0 ) {
        var latestAttempt = getLatestAttempt(this.props.question.attempts)
        if (this.readyForNext()) {
          return (
            <section className="section">
              <div className="container">
                <div className="content">
                  <h4>Excellent</h4>
                  <p>That's correct. Thank you for alpha testing Quill Connect, an open source tool that helps students become better writers.</p>

                  <p><strong>Unique code:</strong> {this.state.sessionKey}</p>
                </div>
              </div>
            </section>
          )
        }else {
          return (
            <section className="section">
              <div className="container">
                <div className="content">
                  <progress className="progress is-primary" value={this.getProgressPercent()} max="100">{this.getProgressPercent()}%</progress>
                  <h6 className="title is-6">Combine the sentences below into one sentence.</h6>
                  {this.renderSentenceFragments()}
                  {this.renderFeedback()}
                  <div className="control">
                    <textarea className="textarea" ref="response" placeholder="Type your answer here. Rememeber, your answer should be just one sentence." onChange={this.handleChange}></textarea>
                  </div>
                  <div className="button-group">
                    <button className={"button is-primary " + this.toggleDisabled()} onClick={this.checkAnswer}>Check answer</button>
                    <Link to={'/results/questions' + questionID} className="button is-info is-outlined">View Results</Link>
                    {this.renderNextQuestionButton()}
                  </div>
                </div>
              </div>
            </section>
          )
        }

      } else {
        return (
          <section className="section">
            <div className="container">
              <div className="content">
                <progress className="progress is-primary" value={this.getProgressPercent()} max="100">{this.getProgressPercent()}%</progress>
                <h6 className="title is-6">Combine the sentences below into one sentence.</h6>
                {this.renderSentenceFragments()}
                {this.renderFeedback()}
                <div className="control">
                  <textarea className="textarea" ref="response" placeholder="Type your answer here. Rememeber, your answer should be just one sentence." onChange={this.handleChange}></textarea>
                </div>
                <div className="button-group">
                  <button className={"button is-primary " + this.toggleDisabled()} onClick={this.checkAnswer}>Check answer</button>
                  <Link to={'/results/questions' + questionID} className="button is-info is-outlined">View Results</Link>
                  {this.renderNextQuestionButton()}
                </div>
              </div>
            </div>
          </section>
        )
      }
    } else {
      return (<p>Loading...</p>)
    }
  }
})

const getLatestAttempt = function (attempts = []) {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex]
}

function select(state) {
  return {
    concepts: state.concepts,
    questions: state.questions,
    question: state.question,
    routing: state.routing
  }
}
export default connect(select)(playQuestion)
