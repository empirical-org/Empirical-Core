import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import actions from '../../actions/concepts'
import questionActions from '../../actions/questions'
import _ from 'underscore'
import { hashToCollection } from 'quill-component-library/dist/componentLibrary'
import QuestionForm from '../questions/questionForm'

class Concept extends React.Component {
  state = {
    prompt: ''
  };

  getConcept = () => {
    const {data} = this.props.concepts, {conceptID} = this.props.params;
    return _.find(data['0'], {uid: conceptID})
  };

  deleteConcept = () => {
    if(confirm("Are you sure?")) {
      this.props.dispatch(actions.deleteConcept(this.props.params.conceptID))
    }
  };

  questionsForConcept = () => {
    const questionsCollection = hashToCollection(this.props.questions.data)
    return questionsCollection.filter(q => q.conceptID === this.props.params.conceptID && q.flag !== 'archived')
  };

  submitNewQuestion = (questionObj, optimalResponseObj) => {
    const questionObjWithConceptID = { ...questionObj, conceptID: this.props.params.conceptID }
    this.props.dispatch(questionActions.submitNewQuestion(questionObjWithConceptID, optimalResponseObj))
  };

  renderNewQuestionForm = () => {
    return <QuestionForm itemLevels={this.props.itemLevels} new={true} question={{}} submit={this.submitNewQuestion} />
  };

  renderQuestionsForConcept = () => {
    var questionsForConcept = this.questionsForConcept()
    var listItems = questionsForConcept.map((question) => {
      const archivedTag = question.flag === 'archived' ? <strong>ARCHIVED - </strong> : ''
      return (<li key={question.key}><Link to={'/admin/questions/' + question.key + '/responses'}>{archivedTag}{question.prompt.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "")}</Link></li>)
    })
    return (
      <ul>{listItems}</ul>
    )

  };

  render() {
    if (this.getConcept()) {
      return (
        <div>
          <Link to={'admin/concepts'}>Return to All Concepts</Link>
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
}

function select(state) {
  return {
    concepts: state.concepts,
    questions: state.questions,
    itemLevels: state.itemLevels,
    routing: state.routing
  }
}

export default connect(select)(Concept)
