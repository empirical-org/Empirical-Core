import React from 'react'
import {connect} from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {clearData, loadData, nextQuestion, submitResponse, updateName, updateCurrentQuestion} from '../../actions/diagnostics.js'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import diagnosticQuestions from './diagnosticQuestions.jsx'

import PlaySentenceFragment from './sentenceFragment.jsx'
import PlayDiagnosticQuestion from './sentenceCombining.jsx'
import LandingPage from './landing.jsx'
import FinishedDiagnostic from './finishedDiagnostic.jsx'
import {getConceptResultsForAllQuestions} from '../../libs/conceptResultsFromDiagnostic'
const request = require('request');

var StudentDiagnostic = React.createClass({

  getInitialState: function () {
    return {
      saved: false
    }
  },

  saveToLMS: function () {
    const results = getConceptResultsForAllQuestions(this.props.playDiagnostic.answeredQuestions)
    request(
      {url: 'https://staging.quill.org/api/v1/activity_sessions/' + this.props.routing.locationBeforeTransitions.query.student,
        method: 'PUT',
        json:
        {
          state: 'finished',
          concept_results: results,
          percentage: 1
        }
      },
      (err,httpResponse,body) => {
        if (httpResponse.statusCode === 200) {
          document.location.href = "http://staging.quill.org/"
          this.setState({saved: true});
        }
        // console.log(err,httpResponse,body)
      }
    )
  },


  componentWillMount: function() {
    this.props.dispatch(clearData())
  },

  submitResponse: function(response) {
    const action = submitResponse(response);
    this.props.dispatch(action)
  },

  renderQuestionComponent: function () {
    if (this.props.question.currentQuestion) {
      return (<Question
                question={this.props.question.currentQuestion}
                submitResponse={this.submitResponse}
                prefill={this.getLesson().prefill}/>)
    }
  },

  questionsForDiagnostic: function () {
    var questionsCollection = hashToCollection(this.props.questions.data)
    const {data} = this.props.lessons, {lessonID} = this.props.params;
    return data[lessonID].questions.map((id) => {
      return _.find(questionsCollection, {key: id})
    })
  },

  startActivity: function (name, data) {
    // this.saveStudentName(name);
    const action = loadData(data)
    this.props.dispatch(action);
    const next = nextQuestion();
    this.props.dispatch(next);
  },

  nextQuestion: function () {
    const next = nextQuestion();
    this.props.dispatch(next);
  },

  getLesson: function () {
    return this.props.lessons.data[this.props.params.lessonID]
  },

  getLessonName: function () {
    return this.props.lessons.data[this.props.params.lessonID].name
  },

  saveStudentName: function (name) {
    this.props.dispatch(updateName(name))
  },

  getData: function() {
    return diagnosticQuestions()
  },

  markIdentify: function (bool) {
    const action = updateCurrentQuestion({identified: bool})
    this.props.dispatch(action)
  },

  getProgressPercent: function () {
    console.log("hey: ", this.props)
    if (this.props.playDiagnostic && this.props.playDiagnostic.answeredQuestions && this.props.playDiagnostic.questionSet) {
      return this.props.playDiagnostic.answeredQuestions.length / this.props.playDiagnostic.questionSet.length * 100
    } else {
      0
    }

  },

  getFetchedData: function() {
    var returnValue = this.getData().map((obj)=>{
      var data = (obj.type==="SC") ? this.props.questions.data[obj.key] : this.props.sentenceFragments.data[obj.key]
      data.key = obj.key;
      // if(obj.type==="SF") {
      //   data.needsIdentification = true
      // } else if(obj.type==="SF2") {
      //   data.needsIdentification = false
      // }
      return {
        "type": obj.type,
        "data": data
      }
    })
    return returnValue
  },

  render: function() {
    const diagnosticID = this.props.params.diagnosticID
    var component;
    if (this.props.questions.hasreceiveddata && this.props.sentenceFragments.hasreceiveddata) {
      var data = this.getFetchedData()
      if(data) {
        if (this.props.playDiagnostic.currentQuestion) {
          if(this.props.playDiagnostic.currentQuestion.type === "SC") {
            component = (<PlayDiagnosticQuestion question={this.props.playDiagnostic.currentQuestion.data} nextQuestion={this.nextQuestion} key={this.props.playDiagnostic.currentQuestion.data.key}/>)

          } else {
            component =   (<PlaySentenceFragment question={this.props.playDiagnostic.currentQuestion.data} currentKey={this.props.playDiagnostic.currentQuestion.data.key}
                                    key={this.props.playDiagnostic.currentQuestion.data.key}
                                    nextQuestion={this.nextQuestion} markIdentify={this.markIdentify}
                                    updateAttempts={this.submitResponse}/>)
          }
        } else if (this.props.playDiagnostic.answeredQuestions.length > 0 && this.props.playDiagnostic.unansweredQuestions.length === 0) {
          component = (<FinishedDiagnostic saveToLMS={this.saveToLMS} saved={this.state.saved}/>)
        }
        else {
          component =  <LandingPage begin={()=>{this.startActivity("John", data)}}/>
          // (
          //   <div className="container">
          //     <button className="button is-info" onClick={()=>{this.startActivity("John", data)}}>Start</button>
          //   </div>
          // )
        }
      }
    } else {
      component =  (<div className="section container">Loading...</div>)
    }

    return (
      <div>
      <progress className="progress diagnostic-progress" value={this.getProgressPercent()} max="100">15%</progress>
      <section className="section is-fullheight minus-nav student">
      <div className="student-container student-container-diagnostic">
          <ReactCSSTransitionGroup
            transitionName="carousel"
            transitionEnterTimeout={350}
            transitionLeaveTimeout={350}
            >
            {component}
          </ReactCSSTransitionGroup>
        </div>
      </section>
      </div>
    )
  }
})

function select(state) {
  return {
    routing: state.routing,
    questions: state.questions,
    playDiagnostic: state.playDiagnostic,
    sentenceFragments: state.sentenceFragments
  }
}
export default connect(select)(StudentDiagnostic)
