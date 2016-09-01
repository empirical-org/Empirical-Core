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

import RenderQuestionFeedback from '../renderForQuestions/feedbackStatements.jsx'
import RenderQuestionCues from '../renderForQuestions/cues.jsx'
import RenderSentenceFragments from '../renderForQuestions/sentenceFragments.jsx'
import RenderFeedback from '../renderForQuestions/feedback.jsx'
import generateFeedbackString from '../renderForQuestions/generateFeedbackString.js'
import getResponse from '../renderForQuestions/checkAnswer.js'
import handleFocus from '../renderForQuestions/handleFocus.js'
import submitQuestionResponse from '../renderForQuestions/submitResponse.js'
import updateResponseResource from '../renderForQuestions/updateResponseResource.js'
import submitPathway from '../renderForQuestions/submitPathway.js'

import ThankYou from '../renderForQuestions/renderThankYou.jsx'
import AnswerForm from '../renderForQuestions/renderFormForAnswer.jsx'

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
      editing: false,
      response: ""
    }
  },

  getInitialValue: function () {
    if (this.props.prefill) {
      return this.getQuestion().prefilledText
    }
  },

  removePrefilledUnderscores: function () {
    this.setState({response: this.state.response.replace(/_/g, "")})
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
    submitQuestionResponse(response,this.props,this.state.sessionKey, submitResponse);
  },

  getRandomReward: function () {
    return _.shuffle(imageCaptionPairs)[0]
  },

  renderSentenceFragments: function () {
    return <RenderSentenceFragments getQuestion={this.getQuestion}/>
  },

  renderFeedback: function () {
    return <RenderFeedback question={this.props.question}
            sentence="We have not seen this sentence before. Could you please try writing it in another way?"
            renderFeedbackStatements = {this.renderFeedbackStatements}/>
  },

  getErrorsForAttempt: function (attempt) {
    return _.pick(attempt, 'typingError', 'caseError', 'punctuationError', 'minLengthError', 'maxLengthError')
  },

  renderFeedbackStatements: function (attempt) {
    return <RenderQuestionFeedback attempt={attempt} getErrorsForAttempt={this.getErrorsForAttempt} getQuestion={this.getQuestion}/>
  },

  renderCues: function () {
    return <RenderQuestionCues getQuestion={this.getQuestion}/>
  },

  updateResponseResource: function (response) {
    updateResponseResource(response, this.props, this.getErrorsForAttempt, "brain")
  },

  submitPathway: function (response) {
    submitPathway(response, this.props);
  },

  checkAnswer: function () {
    this.removePrefilledUnderscores()

    var response = getResponse(this.getQuestion(), this.state.response)
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

  handleChange: function (e) {
    this.setState({editing: true, response: e})
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
    this.setState({response: ""})
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
          <StateFinished sessionKey={this.state.sessionKey} />
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
      } else if (this.props.question.attempts.length > 0 ) {
        var latestAttempt = getLatestAttempt(this.props.question.attempts)
        if (this.readyForNext()) {
          const reward = this.getRandomReward()
          return (
            <Reward caption={reward.caption} imageUrl={reward.imageUrl} next={this.nextQuestion}/>
          )
        } else {
          return (
            <AnswerForm value={this.state.response} question={this.props.question} sentenceFragments={this.renderSentenceFragments()} cues={this.renderCues()}
                  feedback={this.renderFeedback()} initialValue={this.getInitialValue()}
                  handleChange={this.handleChange} textAreaClass="textarea" key={this.props.question.key}
                  toggleDisabled={this.toggleDisabled()} checkAnswer={this.checkAnswer}/>
          )
        }
      } else {
        return (
          <AnswerForm value={this.state.response} question={this.props.question} sentenceFragments={this.renderSentenceFragments()} cues={this.renderCues()}
                feedback={this.renderFeedback()} initialValue={this.getInitialValue()}
                handleChange={this.handleChange} textAreaClass="textarea" key={this.props.question.key}
                toggleDisabled={this.toggleDisabled()} checkAnswer={this.checkAnswer}/>
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
