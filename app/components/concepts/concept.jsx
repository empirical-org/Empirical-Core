import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import actions from '../../actions/concepts'
import questionActions from '../../actions/questions'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import TextEditor from '../questions/textEditor.jsx'

const Concepts = React.createClass({
  getInitialState: function (){
    return {
      prompt: ''
    }
  },

  deleteConcept: function () {
    this.props.dispatch(actions.deleteConcept(this.props.params.conceptID))
  },

  submitNewQuestion: function (e) {
    e.preventDefault()
    if (this.state.prompt !== '') {
      this.props.dispatch(questionActions.submitNewQuestion({
        prompt: this.state.prompt,
        prefilledText: this.refs.newQuestionPrefilledText.value,
        cues: this.refs.cues.value.split(','),
        conceptID: this.props.params.conceptID},
        {text: this.refs.newQuestionOptimalResponse.value.trim(), optimal: true, count: 0, feedback: "That's a great sentence!"}))
      this.refs.newQuestionPrompt.value = ''
      this.refs.newQuestionOptimalResponse.value = ''
      this.refs.newQuestionPrefilledText.value = ''
      this.refs.newQuestionPrompt.focus()
    }
  },

  questionsForConcept: function () {
    var questionsCollection = hashToCollection(this.props.questions.data)
    return _.where(questionsCollection, {conceptID: this.props.params.conceptID})
  },

  copyAnswerToPrefill: function () {
    this.refs.newQuestionPrefilledText.value = this.refs.newQuestionOptimalResponse.value
  },

  handlePromptChange: function (prompt) {
    this.setState({prompt})
  },

  renderQuestionsForConcept: function () {
    var questionsForConcept = this.questionsForConcept()
    var listItems = questionsForConcept.map((question) => {
      return (<li key={question.key}><Link to={'/admin/questions/' + question.key}>{question.prompt}</Link></li>)
    })
    return (
      <ul>{listItems}</ul>
    )

  },

  renderNewQuestionForm: function () {
    return (
      <form className="box" onSubmit={this.submitNewQuestion}>
        <h6 className="control subtitle">Create a new question</h6>
        <label className="label">Prompt</label>
        <TextEditor text={""} handleTextChange={this.handlePromptChange} />
        <label className="label">Cues (seperated by commas, no spaces eg "however,therefore,hence")</label>
        <p className="control">
          <input className="input" type="text" ref="cues"></input>
        </p>
        <label className="label">Optimal Response</label>
        <p className="control">
          <input className="input" type="text" ref="newQuestionOptimalResponse" onBlur={this.copyAnswerToPrefill}></input>
        </p>
        <label className="label">Prefilled Text (place 5 underscores where you want the user to fill in _____)</label>
        <p className="control">
          <input className="input" type="text" ref="newQuestionPrefilledText"></input>
        </p>
        <button type="submit" className="button is-primary" >Add Question</button>
      </form>
    )
  },

  render: function (){
    const {data} = this.props.concepts, {conceptID} = this.props.params;
    if (data[conceptID]) {
      return (
        <div>
          <Link to ={'admin/concepts'}>Return to All Concepts</Link>
          <h4 className="title">{data[conceptID].name}</h4>
          <h6 className="subtitle">{this.questionsForConcept().length} Questions</h6>
          <p className="control">
            <button className="button is-info" onClick={this.editConcept}>Edit Concept</button> <button className="button is-danger" onClick={this.deleteConcept}>Delete Concept</button>
          </p>
          {this.renderNewQuestionForm()}

          {this.renderQuestionsForConcept()}
        </div>
      )
    } else if (this.props.concepts.hasreceiveddata === false){
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
    concepts: state.concepts,
    questions: state.questions,
    routing: state.routing
  }
}

export default connect(select)(Concepts)
