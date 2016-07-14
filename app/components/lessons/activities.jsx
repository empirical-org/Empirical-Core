import React from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/lessons'
import _ from 'underscore'
import { Link } from 'react-router'
import Modal from '../modal/modal.jsx'
import {hashToCollection} from '../../libs/hashToCollection'
import EditLessonForm from './lessonForm.jsx'
import renderQuestionSelect from './lessonForm.jsx'
import renderQuestionsForLesson from './lesson.jsx'
import questionsForLesson from './lesson.jsx'

const Lessons =  React.createClass({

  createNew: function () {
    this.props.dispatch(actions.toggleNewLessonModal())
  },

  submitNewLesson: function (data) {
    this.props.dispatch(actions.submitNewLesson(data))
    // this.props.dispatch(actions.toggleNewLessonModal())
  },

  renderLessons: function () {
    const {data} = this.props.lessons;

    var l = this.props.lessons.data
    var q = this.props.questions.data

    var keys = _.keys(data);
    keys = _.filter(keys, (key) => {
      return data[key].isPublic
    })

    return keys.map((key) => {
      var questionsToDisplay = l[key].questions.map((question) => {
        return (
          <li key={q[question].key} className="menu-list">{q[question].prompt}</li>
        );
      });

      return (<li key={key}>
                <div className="activities-title">
                <Link to={'/play/lesson/' + key} className="menu-label" activeClassName="is-active">{data[key].name}</Link>
                <Link to={'/play/lesson/' + key} className="menu-label is-pulled-right" activeClassName="is-active">Start Activity</Link>
                </div>
                <ul>{questionsToDisplay}</ul>
              </li>)
    })
  },

  renderModal: function () {
    var stateSpecificClass = this.props.lessons.submittingnew ? 'is-loading' : '';
    if (this.props.lessons.newLessonModalOpen) {
        return (
          <Modal close={this.createNew}>
            <EditLessonForm submit={this.submitNewLesson} renderQuestionSelect={this.renderQuestionSelect} stateSpecificClass={stateSpecificClass}/>
          </Modal>
        )
      }
  },


  render: function() {
    return (
      <section className="section">
        <div className="container">
          <h1 className="title is-3">
            Lessons
          </h1>
          <div className="columns">
            <div className="column">
              <aside className="menu">
                <ul>
                  {this.renderLessons()}
                </ul>
              </aside>
            </div>
            <div className="column">
              {this.props.children}
            </div>
          </div>
        </div>
      </section>

    )
  }

})


function select(state) {
  return {
    lessons: state.lessons,
    routing: state.routing,
    questions: state.questions
  }
}

export default connect(select)(Lessons)
