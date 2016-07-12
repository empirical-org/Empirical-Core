import React from 'react'
import { connect } from 'react-redux'
import {hashToCollection} from '../../libs/hashToCollection'

const LessonForm = React.createClass({
  getInitialState: function () {
    return {
      selectedQuestions: []
    }
  },

  submit: function () {
    this.props.submit({
      name: this.refs.newLessonName.value,
      questions: this.state.selectedQuestions,
      introURL: this.refs.introURL.value
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

  render: function () {
    return (
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
        <button className={"button is-primary " + this.props.stateSpecificClass} onClick={this.submit}>Submit</button>
      </p>
    </div>
    )
  }
})

function select(state) {
  return {
    questions: state.questions
  }
}

export default connect(select)(LessonForm)
