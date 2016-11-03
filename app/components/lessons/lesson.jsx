import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import _ from 'underscore'
import {deleteLesson, startLessonEdit}  from '../../actions/lessons.js';
import lessonActions from '../../actions/lessons'
import Modal from '../modal/modal.jsx'
import C from '../../constants.js'
import EditLessonForm from './lessonForm.jsx'

const Lesson = React.createClass({
  questionsForLesson: function () {
    const {data} = this.props.lessons, {lessonID} = this.props.params;
    if(data[lessonID].questions) {
      return data[lessonID].questions.map((question) => {
        // TODO: this is rediculous -- ultimately we need to refactor to include the question type on the object at the point of creation,
        // ensure that both have keys, and create a displayable text field....
        const questionType = question.questionType || 'questions'
        const collection = this.props[questionType].data
        // TODO: go through firebase and make sure each question has a key val, that way we can get rid of the || statement below
        const qFromDB = Object.assign({}, collection[question.key || question]);
        qFromDB.questionType = questionType;
        return qFromDB;
      })
    }
  },


  renderQuestionsForLesson: function () {
    var questionsForLesson = this.questionsForLesson()
    if(questionsForLesson) {
      var listItems = questionsForLesson.map((question) => {
        const nameKey = question.questionType === 'questions' ? 'prompt' : 'questionText'
        // TODO: ask donald -- the sf's link to a blank page, but not a 404 -- does this just mean we don't have results for them?
        return (<li key={question.key}><Link to={`/results/${question.questionType || 'questions'}/` + question.key}>{question[nameKey].replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "")}</Link></li>)
      })
      return (
        <ul>{listItems}</ul>
      )
    } else {
      return (
        <ul>No questions</ul>
      )
    }
  },

  deleteLesson: function () {
    const {lessonID} = this.props.params;
    if(confirm("do you want to do this?")) {
      this.props.dispatch(deleteLesson(lessonID))
      // // console.log("content deleted");
    } else {
      // // console.log("cancel hit");
    }
  },

  cancelEditingLesson: function () {
    this.props.dispatch(lessonActions.cancelLessonEdit(this.props.params.lessonID))
  },

  saveLessonEdits: function (vals) {
    this.props.dispatch(lessonActions.submitLessonEdit(this.props.params.lessonID, vals))
  },

  editLesson: function() {
    const {lessonID} = this.props.params;
    this.props.dispatch(startLessonEdit(lessonID));
    //// console.log("Edit button clicked");
  },

  renderEditLessonForm: function() {
    const {data} = this.props.lessons, {lessonID} = this.props.params;
    const lesson = (data[lessonID]);
    if (this.props.lessons.states[lessonID] === C.EDITING_LESSON) {
      return (
        <Modal close={this.cancelEditingLesson}>
          <EditLessonForm lesson={lesson} submit={this.saveLessonEdits} currentValues={lesson}/>
        </Modal>
      )
    }
  },

  render: function (){
    const {data} = this.props.lessons, {lessonID} = this.props.params;
    if (data[lessonID]) {
      const numberOfQuestions = data[lessonID].questions ? data[lessonID].questions.length : 0
      return (
        <div>
          <Link to ={'admin/lessons'}>Return to All Lessons</Link>
          <br/>
          {this.renderEditLessonForm()}
          <h4 className="title">{data[lessonID].name}</h4>
          <h6 className="subtitle">{numberOfQuestions} Questions</h6>
          <h6 className="subtitle"><Link to={'play/lesson/' + lessonID}>{"quillconnect.firebaseapp.com/#/play/lesson/" + lessonID}</Link></h6>
          <h6 className="subtitle"><Link to={'admin/lessons/' + lessonID + '/results'}>View Results</Link></h6>
          <p className="control">
            <button className="button is-info" onClick={this.editLesson}>Edit Lesson</button> <button className="button is-danger" onClick={this.deleteLesson}>Delete Lesson</button>
          </p>
          {this.renderQuestionsForLesson()}
        </div>
      )
    } else if (this.props.lessons.hasreceiveddata === false){
      return (<p>Loading...</p>)
    } else {
      return (
        <p>404: No Concept Found</p>
      )
    }

  }

})


function select(state) {
  return {
    lessons: state.lessons,
    questions: state.questions,
    routing: state.routing,
    sentenceFragments: state.sentenceFragments
  }
}

export default connect(select)(Lesson)
