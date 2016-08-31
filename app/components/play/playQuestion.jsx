import React from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router'
import Question from '../../libs/question'
import Textarea from 'react-textarea-autosize';
var Markdown = require('react-remarkable');
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import {submitResponseAnon, clearResponsesAnon} from '../../actions.js'
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

const playQuestion = React.createClass({
  getInitialState: function () {
    return {
      editing: false,
      response: ""
    }
  },

  componentDidMount: function() {
    this.props.dispatch(clearResponsesAnon())
    const {questionID} = this.props.params
    var sessionRef = sessionsRef.push({questionID}, (error) => {
      this.setState({sessionKey: sessionRef.key})
    })
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.question.attempts.length > 0) {
      var sessionRef = sessionsRef.child(this.state.sessionKey + '/attempts').set(nextProps.question.attempts, (error) => {
        return
      })
    }
  },

  getInitialValue: function () {
    if (this.props.prefill) {
      return this.getQuestion().prefilledText
    }
  },

  removePrefilledUnderscores: function () {
    const filteredResponse = this.state.response.replace(/_/g, "").replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "")
    this.setState({response: filteredResponse}) //asynchronous, therefore store in variable and return
    return filteredResponse
  },

  getQuestion: function () {
    const {data} = this.props.questions, {questionID} = this.props.params;
    return (data[questionID])
  },

  getResponse2: function (rid) {
    const {data} = this.props.questions, {questionID} = this.props.params;
    return (data[questionID].responses[rid])
  },

  submitResponse: function(response) {
    submitQuestionResponse(response,this.props,this.state.sessionKey, submitResponseAnon);
  },

  renderSentenceFragments: function () {
    return <RenderSentenceFragments getQuestion={this.getQuestion}/>
  },

  renderCues: function () {
    return <RenderQuestionCues getQuestion={this.getQuestion}/>
  },

  renderFeedback: function () {
    return <RenderFeedback sentence="Try Again. What’s another way you could write this sentence?"
            question={this.props.question} renderFeedbackStatements={this.renderFeedbackStatements}/>
  },

  getErrorsForAttempt: function (attempt) {
    return _.pick(attempt, 'typingError', 'caseError', 'punctuationError', 'minLengthError', 'maxLengthError')
  },

  renderFeedbackStatements: function (attempt) {
    return <RenderQuestionFeedback attempt={attempt} getErrorsForAttempt={this.getErrorsForAttempt} getQuestion={this.getQuestion}/>
  },

  updateResponseResource: function (response) {
    updateResponseResource(response, this.props, this.getErrorsForAttempt, "play")
  },

  submitPathway: function (response) {
    submitPathway(response, this.props, "play");
  },

  checkAnswer: function () {
    const filteredResponse = this.removePrefilledUnderscores()
    console.log("Answer that is being checked: ", filteredResponse)
    var response = getResponse(this.getQuestion(), filteredResponse)

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

  handleChange: function (e) {
    this.setState({editing: true,response: e})
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

  renderNextQuestionButton:  function (correct) {
    if (correct) {
      return (<button className="button is-outlined is-success" onClick={this.finish}>Next</button>)
    } else {
      return (<button className="button is-outlined is-warning" onClick={this.finish}>Next</button>)
    }
  },

  render: function () {
    if(!this.props.itemLevels.hasreceiveddata) {
      return (
        <div>Loading...</div>
      )
    } else {
      console.log(this.state)
      const {data} = this.props.questions, {questionID} = this.props.params;
      const question = data[questionID];

      if (question) {
        var assetURL=""
        if(!!question.itemLevel) {
             //Each concept has a unique level
             assetURL = _.find(this.props.itemLevels.data, (level) => {
              return !!level.name && level.name===question.itemLevel && level.conceptID===question.conceptID
            })
            assetURL = assetURL.url
        }

        if (this.state.finished) {
          return (
            <ThankYou sessionKey={this.state.sessionKey} />
          )
        }
        if (this.props.question.attempts.length > 2 ) {
          console.log("this.props.question.attempts.length > 2 (finished with all attempts)")
          return (
            <AnswerForm value={this.state.response} question={this.props.question} getResponse={this.getResponse2} sentenceFragments={this.renderSentenceFragments()} cues={this.renderCues()}
                        feedback={this.renderFeedback()} initialValue={this.getInitialValue()}
                        handleChange={this.handleChange} nextQuestionButton={this.renderNextQuestionButton()}
                        questionID={questionID} id="playQuestion" assetURL={assetURL} textAreaClass="textarea is-question is-disabled"/>
          )
        } else if (this.props.question.attempts.length > 0 ) {
          if (this.readyForNext()) {
            console.log("ready for next (1 or 2 attempts and answered correctly)")
            return (
              <AnswerForm value={this.state.response} question={this.props.question} getResponse={this.getResponse2} sentenceFragments={this.renderSentenceFragments()} cues={this.renderCues()}
                          feedback={this.renderFeedback()} initialValue={this.getInitialValue()}
                          handleChange={this.handleChange} nextQuestionButton={this.renderNextQuestionButton()}
                          questionID={questionID} id="playQuestion" assetURL={assetURL} textAreaClass="textarea is-question submission"/>
            )
          } else {
            console.log("else (1 or 2 attempts but none is correct)")
            return (
              <AnswerForm value={this.state.response} question={this.props.question} getResponse={this.getResponse2} sentenceFragments={this.renderSentenceFragments()} cues={this.renderCues()}
                    feedback={this.renderFeedback()} initialValue={this.getInitialValue()}
                    handleChange={this.handleChange} textAreaClass="textarea is-question submission"
                    toggleDisabled={this.toggleDisabled()} checkAnswer={this.checkAnswer}
                    id="playQuestion" assetURL={assetURL} questionID={questionID}/>
            )
          }
        } else {
          console.log("0 attempts")
          return (
            <AnswerForm value={this.state.response} question={this.props.question} getResponse={this.getResponse2} sentenceFragments={this.renderSentenceFragments()} cues={this.renderCues()}
                  feedback={this.renderFeedback()} initialValue={this.getInitialValue()}
                  handleChange={this.handleChange} textAreaClass="textarea is-question submission"
                  toggleDisabled={this.toggleDisabled()} checkAnswer={this.checkAnswer}
                  id="playQuestion" assetURL={assetURL} questionID={questionID}/>
          )
        }
      } else {
        return (
          <div>Loading...</div>
        )
      }
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
    itemLevels: state.itemLevels,
    routing: state.routing
  }
}
export default connect(select)(playQuestion)
