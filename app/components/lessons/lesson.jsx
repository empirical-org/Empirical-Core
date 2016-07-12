import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import {deleteLesson, startLessonEdit}  from '../../actions/lessons.js';
import lessonActions from '../../actions/lessons'
import Modal from '../modal/modal.jsx'
import C from '../../constants.js'
import EditLessonForm from './lessonForm.jsx'

const Lesson = React.createClass({
  questionsForLesson: function () {
    var questionsCollection = hashToCollection(this.props.questions.data)
    const {data} = this.props.lessons, {lessonID} = this.props.params;
    return data[lessonID].questions.map((id) => {
      return _.find(questionsCollection, {key: id})
    })
    // return _.where(questionsCollection, {key: this.props.lessons.data.question})
  },

  renderQuestionsForLesson: function () {
    var questionsForLesson = this.questionsForLesson()
    var listItems = questionsForLesson.map((question) => {
      return (<li key={question.key}><Link to={'/results/questions/' + question.key}>{question.prompt}</Link></li>)
    })
    return (
      <ul>{listItems}</ul>
    )

  },

  deleteLesson: function () {
    const {lessonID} = this.props.params;
    if(confirm("do you want to do this?")) {
      this.props.dispatch(deleteLesson(lessonID))
      console.log("content deleted");
    } else {
      console.log("cancel hit");
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
    //console.log("Edit button clicked");
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
      return (
        <div>
          {this.renderEditLessonForm()}
          <h4 className="title">{data[lessonID].name}</h4>
          <h6 className="subtitle">{data[lessonID].questions.length} Questions</h6>
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
    routing: state.routing
  }
}

export default connect(select)(Lesson)
