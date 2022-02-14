import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import actions from '../../actions/concepts'
import questionActions from '../../actions/questions'
import _ from 'underscore'
import { hashToCollection } from '../../../Shared/index'
import QuestionForm from '../questions/questionForm'

class Concept extends React.Component {
  state = {
    prompt: ''
  };

  getConcept = () => {
    const { match, concepts } = this.props;
    const { data } = concepts;
    const { params } = match;
    const { conceptID } = params;
    return _.find(data['0'], {uid: conceptID})
  };

  deleteConcept = () => {
    const { dispatch, match } = this.props;
    const { params } = match;
    const { conceptID } = params;
    if(confirm("Are you sure?")) {
      dispatch(actions.deleteConcept(conceptID))
    }
  };

  submitNewQuestion = (questionObj, optimalResponseObj) => {
    const { dispatch, history, match } = this.props;
    const { params } = match;
    const { conceptID } = params;
    const questionObjWithConceptID = { ...questionObj, conceptID: conceptID }
    dispatch(questionActions.submitNewQuestion(questionObjWithConceptID, optimalResponseObj))
  };

  questionsForConcept = () => {
    const {  match, questions } = this.props;
    const { data } = questions;
    const { params } = match;
    const { conceptID } = params;
    const questionsCollection = hashToCollection(data)
    return questionsCollection.filter(q => q.conceptID === conceptID && q.flag !== 'archived')
  };

  renderQuestionsForConcept = () => {
    const questionsForConcept = this.questionsForConcept()
    const listItems = questionsForConcept.map((question) => {
      return <li key={question.key}><Link to={'/admin/questions/' + question.key + '/responses'}>{question.prompt.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "")}</Link></li>;
    })
    return (
      <ul>{listItems}</ul>
    )

  };

  renderNewQuestionForm = () => {
    return <QuestionForm new={true} question={{}} submit={this.submitNewQuestion} />
  };

  render() {
    const { concepts } = this.props;
    const { hasreceiveddata } = concepts;
    if (this.getConcept()) {
      return (
        <div className="admin-container">
          <Link to="/admin/concepts">Return to All Concepts</Link>
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
    routing: state.routing
  }
}

export default connect(select)(Concept)
