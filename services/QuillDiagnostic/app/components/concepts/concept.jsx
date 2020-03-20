import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
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
    const { concepts, params } = this.props;
    const {data} = concepts, {conceptID} = params;
    return _.find(data['0'], {uid: conceptID})
  };

  deleteConcept = () => {
    const { dispatch, params } = this.props;
    const { conceptID } = params;
    if(confirm("Are you sure?")) {
      dispatch(actions.deleteConcept(conceptID))
    }
  };

  submitNewQuestion = (questionObj, optimalResponseObj) => {
    const { dispatch, params } = this.props;
    const { conceptID } = params;
    const questionObjWithConceptID = { ...questionObj, conceptID: conceptID }
    dispatch(questionActions.submitNewQuestion(questionObjWithConceptID, optimalResponseObj))
  };

  questionsForConcept = () => {
    const { questions, params } = this.props;
    const { data } = questions;
    const { conceptID } = params;
    const questionsCollection = hashToCollection(data)
    return questionsCollection.filter(q => q.conceptID === conceptID && q.flag !== 'archived')
  };

  renderQuestionsForConcept = () => {
    const questionsForConcept = this.questionsForConcept()
    const listItems = questionsForConcept.map((question) => {
      return (<li key={question.key}><Link to={'/admin/questions/' + question.key}>{question.prompt.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "")}</Link></li>)
    })
    return (
      <ul>{listItems}</ul>
    )

  };

  renderNewQuestionForm = () => {
    const { itemLevels } = this.props;
    return <QuestionForm itemLevels={itemLevels} new={true} question={{}} submit={this.submitNewQuestion} />
  };

  render() {
    const { concepts } = this.props;
    const { hasreceiveddata } = concepts;
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
    } else if (hasreceiveddata === false){
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
