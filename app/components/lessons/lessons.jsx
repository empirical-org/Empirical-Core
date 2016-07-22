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

  getInitialState: function() {
    return {lessonFlags: "All Flags"}
  },

  createNew: function () {
    this.props.dispatch(actions.toggleNewLessonModal())
  },

  submitNewLesson: function (data) {
    this.props.dispatch(actions.submitNewLesson(data))
    // this.props.dispatch(actions.toggleNewLessonModal())
  },

  renderLessons: function () {
    const {data} = this.props.lessons;
    let keys = _.keys(data);
    if(this.state.lessonFlags !== "All Flags") {
      keys = _.filter(keys, (key) => {
        return data[key].flag === this.state.lessonFlags
      })
    }
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

  handleSelect: function(e) {
    this.setState({lessonFlags: e.target.value})
  },

  render: function() {
    return (
      <section className="section">
        <div className="container">
          <h1 className="title"><button className="button is-primary" onClick={this.createNew}>Create New Lesson</button></h1>
          { this.renderModal() }
          <span className="select">
            <select defaultValue="All Flags" onChange={this.handleSelect}>
              <option value="All Flags">All Flags</option>
              <option value="Alpha">Alpha</option>
              <option value="Beta">Beta</option>
              <option value="Production">Production</option>
              <option value="Archive">Archive</option>
            </select>
          </span>
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
