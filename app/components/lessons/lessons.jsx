import React from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/lessons'
import _ from 'underscore'
import { Link } from 'react-router'
import Modal from '../modal/modal.jsx'
import {hashToCollection} from '../../libs/hashToCollection'
import EditLessonForm from './lessonForm.jsx'
import renderQuestionSelect from './lessonForm.jsx'

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
    const keys = _.keys(data);
    return keys.map((key) => {
      return (<li key={key}><Link to={'/admin/lessons/' + key} activeClassName="is-active">{data[key].name}</Link></li>)
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
          <h1 className="title"><button className="button is-primary" onClick={this.createNew}>Create New Lesson</button></h1>
          { this.renderModal() }
          <div className="columns">
            <div className="column">
              <aside className="menu">
                <p className="menu-label">
                  Lessons
                </p>
                <ul className="menu-list">
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
