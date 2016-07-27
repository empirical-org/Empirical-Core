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

// http://localhost:8080/#/play/questions/-KNDOowPwioDRuYMr7uK is the link in the app that uses this file
// KNDOowPwioDRuYMr7uK is an example of a question key

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
      editing: false
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
    this.refs.response.value = this.refs.response.value.replace(/_/g, "")
  },

  // handleFocus: function (e) {
  //   handleFocus(e);
  //   const indexOfUnderscores = e.target.value.indexOf("_");
  //   const lastIndexOfUnderscores = e.target.value.lastIndexOf("_");
  //   if (indexOfUnderscores !== -1) {
  //     setTimeout(()=>{
  //       e.target.selectionStart = indexOfUnderscores
  //       e.target.selectionEnd = lastIndexOfUnderscores + 1
  //     }, 50)
  //
  //   }
  // },

  getQuestion: function () {
    const {data} = this.props.questions, {questionID} = this.props.params;
    return (data[questionID])
  },

  submitResponse: function(response) {
    // const action = submitResponseAnon(qresponse);
    // this.props.dispatch(action);
    // var sessionRef = sessionsRef.child(this.state.sessionKey + '/attempts').set(this.props.question.attempts, (error) => {
    //   return
    // })
    submitQuestionResponse(response,this.props,this.state.sessionKey, submitResponseAnon);
  },

  renderSentenceFragments: function () {
    return <RenderSentenceFragments getQuestion={this.getQuestion}/>
    // return (
    //   <div className="draft-js sentence-fragments" dangerouslySetInnerHTML={{__html: this.getQuestion().prompt}}></div>
    // )
    // return this.props.question.sentences.map((sentence, index) => {
    //   return (<li key={index}>{sentence}</li>)
    // })
  },

  renderCues: function () {
    return <RenderQuestionCues getQuestion={this.getQuestion}/>
    // if (this.getQuestion().cues && this.getQuestion().cues.length > 0 && this.getQuestion().cues[0] !== "") {
    //   const cueDivs = this.getQuestion().cues.map((cue) => {
    //     return (
    //       <div className="cue">
    //         {cue}
    //       </div>
    //     )
    //   })
    //   return (
    //     <div className="cues">
    //       {cueDivs}
    //     </div>
    //   )
    // }
  },

  renderFeedback: function () {
    // const latestAttempt = getLatestAttempt(this.props.question.attempts)
    // if (latestAttempt) {
    //   if (latestAttempt.found && latestAttempt.response.feedback !== undefined) {
    //     return <ul className="is-unstyled">{this.renderFeedbackStatements(latestAttempt)}</ul>
    //   } else {
    //     return (
    //       <h5 className="title is-5">Try Again. What’s another way you could write this sentence?</h5>
    //     )
    //   }
    // } else {
    //   return (
    //     <h5 className="title is-5">Combine the sentences into one sentence.</h5>
    //   )
    // }
    return <RenderFeedback sentence="Try Again. What’s another way you could write this sentence?"
            question={this.props.question} renderFeedbackStatements={this.renderFeedbackStatements}/>
  },

  getErrorsForAttempt: function (attempt) {
    return _.pick(attempt, 'typingError', 'caseError', 'punctuationError', 'minLengthError', 'maxLengthError')
  },

  // generateFeedbackString: function (attempt) {
  //   const errors = this.getErrorsForAttempt(attempt);
  //   // add keys for react list elements
  //   var errorComponents = _.values(_.mapObject(errors, (val, key) => {
  //     if (val) {
  //       return feedbackStrings[key]
  //     }
  //   }))
  //   return errorComponents[0]
  // },

  renderFeedbackStatements: function (attempt) {
    // const errors = this.getErrorsForAttempt(attempt);
    // // add keys for react list elements
    // var components = []
    // if (_.isEmpty(errors)) {
    //   components = components.concat([(<li key="feedback" dangerouslySetInnerHTML={{__html: attempt.response.feedback}}></li>)])
    // }
    // var errorComponents = _.values(_.mapObject(errors, (val, key) => {
    //   if (val) {
    //     return (<li key={key}><h5 className="title is-5">{feedbackStrings[key]}.</h5></li>)
    //   }
    // }))
    // if (attempt.response.parentID && (this.getQuestion().responses[attempt.response.parentID].optimal !== true )) {
    //   const parentResponse = this.getQuestion().responses[attempt.response.parentID]
    //   components = [(<li key="parentfeedback" dangerouslySetInnerHTML={{__html: parentResponse.feedback}}></li>)].concat(components)
    // }
    // return components.concat(errorComponents)
    return <RenderQuestionFeedback attempt={attempt} getErrorsForAttempt={this.getErrorsForAttempt} getQuestion={this.getQuestion}/>
  },

  updateResponseResource: function (response) {
    updateResponseResource(response, this.props, this.getErrorsForAttempt, "play")
    // var previousAttempt;
    // const responses = hashToCollection(this.getQuestion().responses);
    // const preAtt = getLatestAttempt(this.props.question.attempts)
    // if (preAtt) {previousAttempt = _.find(responses, {text: getLatestAttempt(this.props.question.attempts).submitted}) }
    // const prid = previousAttempt ? previousAttempt.key : undefined
    // if (response.found) {
    //
    //   // var latestAttempt = getLatestAttempt(this.props.question.attempts)
    //   var errors = _.keys(this.getErrorsForAttempt(response))
    //   if (errors.length === 0) {
    //     this.props.dispatch(
    //       questionActions.incrementResponseCount(this.props.params.questionID, response.response.key, prid)
    //     )
    //   } else {
    //     var newErrorResp = {
    //       text: response.submitted,
    //       count: 1,
    //       parentID: response.response.key,
    //       author: response.author,
    //       feedback: generateFeedbackString(response)
    //     }
    //     console.log("newErrorResp.feedback inside playQuestion: ", newErrorResp.feedback)
    //     this.props.dispatch(
    //       questionActions.submitNewResponse(this.props.params.questionID, newErrorResp, prid)
    //     )
    //   }
    // } else {
    //   var newResp = {
    //     text: response.submitted,
    //     count: 1
    //   }
    //   this.props.dispatch(
    //     questionActions.submitNewResponse(this.props.params.questionID, newResp, prid)
    //   )
    // }
  },

  submitPathway: function (response) {
    submitPathway(response, this.props, "play");
    // var data = {};
    // var previousAttempt;
    // const responses = hashToCollection(this.getQuestion().responses);
    // const preAtt = getLatestAttempt(this.props.question.attempts)
    // if (preAtt) {previousAttempt = _.find(responses, {text: getLatestAttempt(this.props.question.attempts).submitted}) }
    // const newAttempt = _.find(responses, {text: response.submitted})
    //
    // if (previousAttempt) {
    //   data.fromResponseID = previousAttempt.key
    // }
    // if (newAttempt) {
    //   data.toResponseID = newAttempt.key
    //   data.questionID = this.props.params.questionID
    //   this.props.dispatch(pathwayActions.submitNewPathway(data))
    // }
  },

  checkAnswer: function () {
    this.removePrefilledUnderscores()
    // var fields = {
    //   prompt: this.getQuestion().prompt,
    //   responses: hashToCollection(this.getQuestion().responses)
    // }
    // var question = new Question(fields);
    // var response = question.checkMatch(this.refs.response.value);
    var response = getResponse(this.getQuestion(), this.refs)
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
    console.log("initialValue: ", this.getInitialValue())
    const {data} = this.props.questions, {questionID} = this.props.params; //DIFFERENCE
    if (data[questionID]) {
      if (this.state.finished) {
        return (
          <ThankYou sessionKey={this.state.sessionKey} />
          // <section className="section">
          //   <div className="container">
          //     <div className="content">
          //       <h4>Thank you for playing</h4>
          //       <p>Thank you for alpha testing Quill Connect, an open source tool that helps students become better writers.</p>
          //       <p><Link to={'/play'} className="button is-primary is-outlined">Try Another Question</Link></p>
          //       <p><strong>Unique code:</strong> {this.state.sessionKey}</p>
          //     </div>
          //   </div>
          // </section>
        )
      }
      if (this.props.question.attempts.length > 2 ) {
        return (
          <AnswerForm sentenceFragments={this.renderSentenceFragments()} cues={this.renderCues()}
                      feedback={this.renderFeedback()} initialValue={this.getInitialValue()}
                      handleChange={this.handleChange} nextQuestionButton={this.renderNextQuestionButton()}
                      questionID={questionID} id="playQuestion" textAreaClass="textarea is-question submission"/>
          // <section className="section">
          //   <div className="container">
          //     {this.renderSentenceFragments()}
          //     <div className="content">
          //       {this.renderCues()}
          //       {this.renderFeedback()}
          //       <div className="control">
          //         <Textarea className="textarea is-question submission" ref="response" onFocus={handleFocus} defaultValue={this.getInitialValue()} placeholder="Type your answer here. Rememeber, your answer should be just one sentence." onChange={this.handleChange}></Textarea>
          //       </div>
          //       <div className="button-group">
          //         {this.renderNextQuestionButton()}
          //         <Link to={'/results/questions/' + questionID} className="button is-info is-outlined">View Results</Link>
          //       </div>
          //     </div>
          //   </div>
          // </section>
        )
      } else if (this.props.question.attempts.length > 0 ) {
        if (this.readyForNext()) {
          return (
            <AnswerForm sentenceFragments={this.renderSentenceFragments()} cues={this.renderCues()}
                        feedback={this.renderFeedback()} initialValue={this.getInitialValue()}
                        handleChange={this.handleChange} nextQuestionButton={this.renderNextQuestionButton()}
                        questionID={questionID} id="playQuestion" textAreaClass="textarea is-question submission"/>
            // <section className="section">
            //   <div className="container">
            //     {this.renderSentenceFragments()}
            //     <div className="content">
            //       {this.renderCues()}
            //       {this.renderFeedback()}
            //       <div className="control">
            //         <Textarea className="textarea is-question submission" ref="response" onFocus={handleFocus} defaultValue={this.getInitialValue()} placeholder="Type your answer here. Rememeber, your answer should be just one sentence." onChange={this.handleChange}></Textarea>
            //       </div>
            //       <div className="button-group">
            //         {this.renderNextQuestionButton(true)}
            //         <Link to={'/results/questions/' + questionID} className="button is-info is-outlined">View Results</Link>
            //       </div>
            //     </div>
            //   </div>
            // </section>
          )
        } else {
          return (
            <section className="section">
              <div className="container">
                {this.renderSentenceFragments()}
                <div className="content">
                  {this.renderCues()}
                  {this.renderFeedback()}
                  <div className="control">
                    <Textarea className="textarea is-question submission" ref="response" onFocus={handleFocus} defaultValue={this.getInitialValue()} placeholder="Type your answer here. Rememeber, your answer should be just one sentence." onChange={this.handleChange}></Textarea>
                  </div>
                  <div className="button-group">
                    <button className={"button is-primary " + this.toggleDisabled()} onClick={this.checkAnswer}>Check answer</button>
                    <Link to={'/results/questions/' + questionID} className="button is-info is-outlined">View Results</Link>

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
              {this.renderSentenceFragments()}
              <div className="content">
                {this.renderCues()}
                {this.renderFeedback()}
                <div className="control">
                  <Textarea className="textarea is-question submission" ref="response" onFocus={handleFocus} defaultValue={this.getInitialValue()} placeholder="Type your answer here. Rememeber, your answer should be just one sentence." onChange={this.handleChange}></Textarea>
                </div>
                <div className="button-group">
                  <button className={"button is-primary " + this.toggleDisabled()} onClick={this.checkAnswer}>Check answer</button>
                  <Link to={'/results/questions/' + questionID} className="button is-info is-outlined">View Results</Link>

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
