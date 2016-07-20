import React from 'react'

import {connect} from 'react-redux'
import { Link } from 'react-router'
import Question from '../../libs/question'
import Reward from './reward.jsx'
import Incorrect from './incorrect.jsx'
import Goal from './goal.jsx'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import {submitResponse, clearResponses, startQuestion} from '../../actions.js'
import questionActions from '../../actions/questions'
import pathwayActions from '../../actions/pathways'
var C = require("../../constants").default
import rootRef from "../../libs/firebase"
const sessionsRef = rootRef.child('sessions')

const feedbackStrings = {
  punctuationError: "There may be an error. How could you update the punctuation?",
  typingError: "Try again. There may be a spelling mistake.",
  caseError: "Try again. There may be a capitalization error.",
  minLengthError: "Try again. Do you have all of the information from the prompt?",
  maxLengthError: "Try again. How could this sentence be shorter and more concise?"
}

const imageCaptionPairs = [
  {
    imageUrl: "https://s3.amazonaws.com/quill-connect-funny-pictures/Gecko+Eating+Honey.png",
    caption: "Here’s a picture of some gecko’s eating jam"
  },
  {
    imageUrl: "https://s3.amazonaws.com/quill-connect-funny-pictures/Explorers+1.gif",
    caption: "Here’s an animation of space explorers"
  },
  {
    imageUrl: "https://s3.amazonaws.com/quill-connect-funny-pictures/Explorers+2.gif",
    caption: "Here’s an animation of space explorers"
  },
  {
    imageUrl: "https://s3.amazonaws.com/quill-connect-funny-pictures/Explorers+3.gif",
    caption: "Here’s an animation of space explorers"
  },
  {
    imageUrl: "https://s3.amazonaws.com/quill-connect-funny-pictures/Explorers+4.gif",
    caption: "Here’s an animation of space explorers"
  },
]

const playLessonQuestion = React.createClass({

  getInitialState: function () {
    return {
      editing: false
    }
  },

  getInitialValue: function () {
    if (this.props.prefill) {
      return this.getQuestion().prefilledText
    }
  },

  removePrefilledUnderscores: function () {
    this.refs.response.value = this.refs.response.value.replace(/_/g, "")
  },

  handleFocus: function (e) {
    const indexOfUnderscores = e.target.value.indexOf("_");
    const lastIndexOfUnderscores = e.target.value.lastIndexOf("_");
    if (indexOfUnderscores !== -1) {
      setTimeout(()=>{
        e.target.selectionStart = indexOfUnderscores
        e.target.selectionEnd = lastIndexOfUnderscores + 1
      }, 50)

    }
  },

  componentWillReceiveProps: function(nextProps) {
    // if (nextProps.question.attempts.length > 0) {
    //   var sessionRef = sessionsRef.child(this.state.sessionKey + '/attempts').set(nextProps.question.attempts, (error) => {
    //     return
    //   })
    // }
  },

  getQuestion: function () {
    return this.props.question
  },

  submitResponse: function(response) {
    const action = submitResponse(response);
    this.props.dispatch(action);
    var sessionRef = sessionsRef.child(this.state.sessionKey + '/attempts').set(this.props.question.attempts, (error) => {
      return
    })
  },

  getRandomReward: function () {
    return _.shuffle(imageCaptionPairs)[0]
  },

  renderSentenceFragments: function () {
    return (
      <div dangerouslySetInnerHTML={{__html: this.getQuestion().prompt}}></div>
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
          <h5 className="title is-5">We have not seen this sentence before. Could you please try writing it in another way?</h5>
        )
      }
    } else {
      return (
        <h5 className="title is-5">Combine the sentences into one sentence.</h5>
      )
    }
  },

  getErrorsForAttempt: function (attempt) {
    return _.pick(attempt, 'typingError', 'caseError', 'punctuationError', 'minLengthError', 'maxLengthError')
  },

  generateFeedbackString: function (attempt) {
    const errors = this.getErrorsForAttempt(attempt);
    // add keys for react list elements
    var errorComponents = _.values(_.mapObject(errors, (val, key) => {
      if (val) {
        return feedbackStrings[key]
      }
    }))
    return errorComponents[0]
  },

  renderFeedbackStatements: function (attempt) {
    const errors = this.getErrorsForAttempt(attempt);
    // add keys for react list elements
    var components = []
    if (_.isEmpty(errors)) {
      components = components.concat([(<li key="feedback" dangerouslySetInnerHTML={{__html: attempt.response.feedback}}></li>)])
    }
    var errorComponents = _.values(_.mapObject(errors, (val, key) => {
      if (val) {
        return (<li key={key}><h5 className="title is-5">{feedbackStrings[key]}.</h5></li>)
      }
    }))
    if (attempt.response.parentID && (this.getQuestion().responses[attempt.response.parentID].optimal !== true )) {
      const parentResponse = this.getQuestion().responses[attempt.response.parentID]
      components = [(<li key="parentfeedback" dangerouslySetInnerHTML={{__html: parentResponse.feedback}}></li>)].concat(components)
    }
    return components.concat(errorComponents)
  },

  updateResponseResource: function (response) {
    var previousAttempt;
    const responses = hashToCollection(this.getQuestion().responses);
    const preAtt = getLatestAttempt(this.props.question.attempts)
    if (preAtt) {previousAttempt = _.find(responses, {text: getLatestAttempt(this.props.question.attempts).submitted}) }
    const prid = previousAttempt ? previousAttempt.key : undefined
    if (response.found) {

      // var latestAttempt = getLatestAttempt(this.props.question.attempts)
      var errors = _.keys(this.getErrorsForAttempt(response))
      if (errors.length === 0) {
        this.props.dispatch(
          questionActions.incrementResponseCount(this.props.question.key, response.response.key, prid)
        )
      } else {
        var newErrorResp = {
          text: response.submitted,
          count: 1,
          parentID: response.response.key,
          author: response.author,
          feedback: this.generateFeedbackString(response)
        }
        this.props.dispatch(
          questionActions.submitNewResponse(this.props.question.key, newErrorResp, prid)
        )
      }
    } else {
      var newResp = {
        text: response.submitted,
        count: 1
      }
      this.props.dispatch(
        questionActions.submitNewResponse(this.props.question.key, newResp, prid)
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

    if (previousAttempt) {
      data.fromResponseID = previousAttempt.key
    }
    if (newAttempt) {
      data.toResponseID = newAttempt.key
      data.this.props.question.key = this.props.question.key
      this.props.dispatch(pathwayActions.submitNewPathway(data))
    }
  },

  checkAnswer: function () {
    this.removePrefilledUnderscores()
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

  getOptimalResponses: function () {
    var fields = {
      prompt: this.getQuestion().prompt,
      responses: hashToCollection(this.getQuestion().responses)
    }
    var question = new Question(fields);
    return question.getOptimalResponses()
  },

  getSubOptimalResponses: function () {
    var fields = {
      prompt: this.getQuestion().prompt,
      responses: hashToCollection(this.getQuestion().responses)
    }
    var question = new Question(fields);
    return question.getSubOptimalResponses()
  },

  get4MarkedResponses: function () {
    var twoOptimal = _.first(_.shuffle(this.getOptimalResponses()), 2)
    var twoSubOptimal = _.first(_.shuffle(this.getSubOptimalResponses()), 2)
    return _.shuffle(twoOptimal.concat(twoSubOptimal))
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

  finish: function () {
    this.setState({finished: true})
  },

  nextQuestion: function () {
    this.props.nextQuestion()
  },

  renderNextQuestionButton:  function (correct) {
    if (correct) {
      return (<button className="button is-outlined is-success" onClick={this.nextQuestion}>Next</button>)
    } else {
      return (<button className="button is-outlined is-warning" onClick={this.nextQuestion}>Next</button>)
    }

  },

  startQuestion: function () {
    this.props.dispatch(startQuestion())
  },

  getNumberOfStrongAnswers: function () {
    return 2
  },

  render: function () {
    if (this.props.question) {
      if (!this.props.question.started) {
        return (
          <Goal strongSentenceCount={this.props.strongSentenceCount} lesson={this.props.lesson} strong={this.getNumberOfStrongAnswers()} startQuestion={this.startQuestion}/>
        )
      }
      if (this.state.finished) {
        return (
          <section className="section">
            <div className="container">
              <div className="content">
                <h4>Thank you for playing</h4>
                <p>Thank you for alpha testing Quill Connect, an open source tool that helps students become better writers.</p>
                <p><Link to={'/play'} className="button is-primary is-outlined">Try Another Question</Link></p>
                <p><strong>Unique code:</strong> {this.state.sessionKey}</p>
              </div>
            </div>
          </section>
        )
      }
      if (this.props.question.attempts.length > 2 ) {
        if (this.readyForNext()) {
          const reward = this.getRandomReward()
          return (
            <Reward caption={reward.caption} imageUrl={reward.imageUrl} next={this.nextQuestion}/>
          )
        } else {
          return (
            <Incorrect answers={this.get4MarkedResponses()} next={this.nextQuestion}/>
          )
        }
        return (
          <section className="section">
            <div className="container">
              <div className="content">
                <progress className="progress is-primary" value={this.getProgressPercent()} max="100">{this.getProgressPercent()}%</progress>
                {this.renderSentenceFragments()}
                {this.renderFeedback()}
                <div className="control">
                  <textarea className="textarea is-disabled" ref="response" onFocus={this.handleFocus} defaultValue={this.getInitialValue()} placeholder="Type your answer here. Rememeber, your answer should be just one sentence." onChange={this.handleChange}></textarea>
                </div>
                <div className="button-group">
                  {this.renderNextQuestionButton()}
                </div>
              </div>
            </div>
          </section>
        )
      } else if (this.props.question.attempts.length > 0 ) {
        var latestAttempt = getLatestAttempt(this.props.question.attempts)
        if (this.readyForNext()) {
          const reward = this.getRandomReward()
          return (
            <Reward caption={reward.caption} imageUrl={reward.imageUrl} next={this.nextQuestion}/>
          )
        }else {
          return (
            <section className="section">
              <div className="container">
                <div className="content">
                  <progress className="progress is-primary" value={this.getProgressPercent()} max="100">{this.getProgressPercent()}%</progress>

                  {this.renderSentenceFragments()}
                  {this.renderFeedback()}
                  <div className="control">
                    <textarea className="textarea" ref="response" onFocus={this.handleFocus} defaultValue={this.getInitialValue()} placeholder="Type your answer here. Rememeber, your answer should be just one sentence." onChange={this.handleChange}></textarea>
                  </div>
                  <div className="button-group">
                    <button className={"button is-primary " + this.toggleDisabled()} onClick={this.checkAnswer}>Check answer</button>

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
                {this.renderSentenceFragments()}
                {this.renderFeedback()}
                <div className="control">
                  <textarea className="textarea" ref="response" onFocus={this.handleFocus} defaultValue={this.getInitialValue()} placeholder="Type your answer here. Rememeber, your answer should be just one sentence." onChange={this.handleChange}></textarea>
                </div>
                <div className="button-group">
                  <button className={"button is-primary " + this.toggleDisabled()} onClick={this.checkAnswer}>Check answer</button>
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
    routing: state.routing
  }
}
export default connect(select)(playLessonQuestion)
