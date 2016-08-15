import React from 'react'
import {connect} from 'react-redux'

import {clearData, loadData, nextQuestion, submitResponse, updateName} from '../../actions.js'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'

import PlaySentenceFragment from '../sentenceFragments/playSentenceFragment.jsx'
import PlayDiagnosticQuestion from './sentenceCombining.jsx'

var StudentDiagnostic = React.createClass({
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
    return [
      {
        type: "SF",
        key: "-KOqKBMgXHF2dNMM8jhg"
      },
      {
        type: "SC",
        key: "-KNcBGQSqXizYXclcM6C"
      }
    ]
  },

  getFetchedData: function() {
    var returnValue = this.getData().map((obj)=>{
      var data = (obj.type==="SC") ? this.props.questions.data[obj.key] : this.props.sentenceFragments.data[obj.key]
      data.key = obj.key;
      return {
        "type": obj.type,
        "data": data
      }
    })
    return returnValue
  },

  render: function() {
    const diagnosticID = this.props.params.diagnosticID
    if (this.props.questions.hasreceiveddata && this.props.sentenceFragments.hasreceiveddata) {
      var data = this.getFetchedData()
      if(data) {
        if (this.props.playDiagnostic.currentQuestion) {
          console.log("Current Question Type: ", this.props.playDiagnostic.currentQuestion)
          if(this.props.playDiagnostic.currentQuestion.type === "SC") {
            console.log("this.props.playDiagnostic: ", this.props.playDiagnostic)
            //prefill={this.getLesson().prefill} was removed from <PlayLessonQuestion> below
            return (
              <PlayDiagnosticQuestion key={this.props.playDiagnostic.currentQuestion.data.key} question={this.props.playDiagnostic.currentQuestion.data} nextQuestion={this.nextQuestion}/>
            )
          } else {
            console.log("this.props.playSentenceFragment: ", this.props.playDiagnostic.currentQuestion.data)
            return (
              <PlaySentenceFragment currentKey={this.props.playDiagnostic.currentQuestion.data.key} nextQuestion={this.nextQuestion}/>
            )
          }

          // return (
          //   <PlayLessonQuestion key={this.props.playDiagnostic.currentQuestion.key} question={this.props.playDiagnostic.currentQuestion} nextQuestion={this.nextQuestion} prefill={this.getLesson().prefill}/>
          // )
        }
        else if (this.props.playDiagnostic.answeredQuestions.length > 0 && (this.props.playDiagnostic.unansweredQuestions.length === 0 && this.props.playDiagnostic.currentQuestion === undefined )) {
          return (<div>Finshed diagnostic</div>)
          // return (<Finished data={this.props.playDiagnostic} diagnosticID={this.props.params.diagnosticID}/>)
        }
        else {
          return (
            <div className="container">
              <button className="button is-info" onClick={()=>{this.startActivity("John", data)}}>Start</button>
            </div>
          )
          // return (
          //   <Register lesson={this.getLesson()} startActivity={this.startActivity}/>
          // )
        }
      }
    } else {
      return (<p>Loading...</p>)
    }
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
