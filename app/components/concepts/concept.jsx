import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import actions from '../../actions/concepts'
import questionActions from '../../actions/questions'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'

const Concepts = React.createClass({

  // renderConcepts: function () {
  //   const {data} = this.props.concepts;
  //   const keys = _.keys(data);
  //   return keys.map((key) => {
  //     console.log(key, data, data[key])
  //     return (<li><Link to={'/admin/concepts/' + key}>{data[key].name}</Link></li>)
  //   })
  // },

  deleteConcept: function () {
    this.props.dispatch(actions.deleteConcept(this.props.params.conceptID))
  },

  submitNewQuestion: function () {
    if (this.refs.newQuestionPrompt.value !== '') {
      this.props.dispatch(questionActions.submitNewQuestion({
        prompt: this.refs.newQuestionPrompt.value,
        conceptID: this.props.params.conceptID},
        {text: this.refs.newQuestionOptimalResponse.value, optimal: true, count: 0, feedback: "That's a great sentence!"}))
      this.refs.newQuestionPrompt.value = ''
      this.refs.newQuestionPrompt.focus()
    }
  },

  questionsForConcept: function () {
    var questionsCollection = hashToCollection(this.props.questions.data)
    return _.where(questionsCollection, {conceptID: this.props.params.conceptID})
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
      <div className="box">
        <h6 className="control subtitle">Create a new question</h6>
        <label className="label">Prompt</label>
        <p className="control">
          <input className="input" type="text" ref="newQuestionPrompt"></input>
        </p>
        <label className="label">Optimal Response</label>
        <p className="control">
          <input className="input" type="text" ref="newQuestionOptimalResponse"></input>
        </p>
        <button className="button is-primary" onClick={this.submitNewQuestion}>Add Question</button>
      </div>
    )
  },

  render: function (){
    const {data} = this.props.concepts, {conceptID} = this.props.params;
    if (data[conceptID]) {
      return (
        <div>
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
