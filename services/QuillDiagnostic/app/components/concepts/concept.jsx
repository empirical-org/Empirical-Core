import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import actions from '../../actions/concepts'
import questionActions from '../../actions/questions'
import _ from 'underscore'
import { hashToCollection } from 'quill-component-library/dist/componentLibrary'
import QuestionForm from '../questions/questionForm'

const Concept = React.createClass({
  getInitialState: function (){
    return {
      prompt: ''
    }
  },

  getConcept: function () {
    const {data} = this.props.concepts, {conceptID} = this.props.params;
    return _.find(data['0'], {uid: conceptID})
  },

  deleteConcept: function () {
    if(confirm("Are you sure?")) {
      this.props.dispatch(actions.deleteConcept(this.props.params.conceptID))
    }
  },

  submitNewQuestion: function (questionObj, optimalResponseObj) {
    const questionObjWithConceptID = { ...questionObj, conceptID: this.props.params.conceptID }
    this.props.dispatch(questionActions.submitNewQuestion(questionObjWithConceptID, optimalResponseObj))
  },

  questionsForConcept: function () {
    var questionsCollection = hashToCollection(this.props.questions.data)
    return _.where(questionsCollection, {conceptID: this.props.params.conceptID})
  },

  renderQuestionsForConcept: function () {
    var questionsForConcept = this.questionsForConcept()
    var listItems = questionsForConcept.map((question) => {
      return (<li key={question.key}><Link to={'/admin/questions/' + question.key}>{question.prompt.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "")}</Link></li>)
    })
    return (
      <ul>{listItems}</ul>
    )

  },

  renderNewQuestionForm: function () {
    return <QuestionForm new={true} itemLevels={this.props.itemLevels} question={{}} submit={this.submitNewQuestion} />
  },

  render: function (){
    const {data} = this.props.concepts, {conceptID} = this.props.params;
    if (this.getConcept()) {
      return (
        <div>
          <Link to ={'admin/concepts'}>Return to All Concepts</Link>
          <h4 className="title">{this.getConcept().displayName}</h4>
          <h6 className="subtitle">{this.questionsForConcept().length} Questions</h6>
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
    itemLevels: state.itemLevels,
    routing: state.routing
  }
}

export default connect(select)(Concept)
