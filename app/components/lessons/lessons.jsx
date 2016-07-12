import React from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/lessons'
import _ from 'underscore'
import { Link } from 'react-router'
import Modal from '../modal/modal.jsx'
import {hashToCollection} from '../../libs/hashToCollection'

const Lessons =  React.createClass({
  getInitialState: function () {
    return {
      selectedQuestions: []
    }
  },

  createNew: function () {
    this.props.dispatch(actions.toggleNewLessonModal())
  },

  submitNewLesson: function () {
    var newLesson = {
      name: this.refs.newLessonName.value,
      questions: this.state.selectedQuestions,
      introURL: this.refs.introURL.value
    }
    this.props.dispatch(actions.submitNewLesson(newLesson))
    this.refs.newLessonName.value = ""
    this.setState({selectedQuestions: []})
    // this.props.dispatch(actions.toggleNewLessonModal())
  },

  renderLessons: function () {
    const {data} = this.props.lessons;
    const keys = _.keys(data);
    return keys.map((key) => {
      return (<li key={key}><Link to={'/admin/lessons/' + key} activeClassName="is-active">{data[key].name}</Link></li>)
    })
  },

  handleChange: function (value) {
    const currentSelectedQuestions = this.state.selectedQuestions;
    var newSelectedQuestions;
    if (_.indexOf(currentSelectedQuestions, value) === -1) {
      newSelectedQuestions = currentSelectedQuestions.concat([value]);
    } else {
      newSelectedQuestions = _.without(currentSelectedQuestions, value)
    }
    this.setState({selectedQuestions: newSelectedQuestions}, () => {
      console.log("new state: ", this.state.selectedQuestions)
    })

  },

  renderQuestionSelect: function () {
    const formattedQuestions = hashToCollection(this.props.questions.data).map((question) => {
      return {
        value: question.key,
        title: question.prompt
      }
    })
    const components = formattedQuestions.map((question) => {
      return (
        <p className="control">
          <label className="checkbox">
            <input type="checkbox" onChange={this.handleChange.bind(null, question.value)}/>
            {question.title}
          </label>
        </p>
      )
    })
    return (
      <div>
        {components}
      </div>
    )
  },

  renderModal: function () {
    var stateSpecificClass = this.props.lessons.submittingnew ? 'is-loading' : '';
    if (this.props.lessons.newLessonModalOpen) {
        return (
          <Modal close={this.createNew}>
            <div className="box">
              <h4 className="title">Add New Lesson</h4>
              <p className="control">
                <label className="label">Name</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Text input"
                  ref="newLessonName"
                />
              </p>
              <p className="control">
                <label className="label">Intro URL (You can link to a video or slideshow)</label>
                <input
                  className="input"
                  type="text"
                  placeholder="http://example.com"
                  ref="introURL"
                />
              </p>
              <p className="control">
                {this.renderQuestionSelect()}
              </p>
              <p className="control">
                <button className={"button is-primary " + stateSpecificClass} onClick={this.submitNewLesson}>Submit</button>
              </p>
            </div>
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
