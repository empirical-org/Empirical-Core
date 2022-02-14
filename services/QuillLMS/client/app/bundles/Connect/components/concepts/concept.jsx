import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import actions from '../../actions/concepts'
import questionActions from '../../actions/questions'
import _ from 'underscore'
import { hashToCollection } from '../../../Shared/index'

class Concept extends React.Component {
  state = {
    prompt: ''
  };

  getConcept = () => {
    const { concepts, match } = this.props
    const { data } = concepts
    const { params } = match
    const { conceptID } = params
    return _.find(data['0'], {uid: conceptID})
  };

  deleteConcept = () => {
    const { dispatch, match } = this.props
    const { params } = match
    const { conceptID } = params
    if(confirm("Are you sure?")) {
      dispatch(actions.deleteConcept(conceptID))
    }
  };

  questionsForConcept = () => {
    const { match, questions } = this.props
    const { data } = questions
    const { params } = match
    const { conceptID } = params
    const questionsCollection = hashToCollection(data)
    return questionsCollection.filter(q => q.conceptID === conceptID && q.flag !== 'archived')
  };

  submitNewQuestion = (questionObj, optimalResponseObj) => {
    const { dispatch, match } = this.props
    const { params } = match
    const { conceptID } = params
    const questionObjWithConceptID = { ...questionObj, conceptID: conceptID }
    dispatch(questionActions.submitNewQuestion(questionObjWithConceptID, optimalResponseObj))
  };

  renderQuestionsForConcept = () => {
    const questionsForConcept = this.questionsForConcept()
    const listItems = questionsForConcept.map((question) => {
      const archivedTag = question.flag === 'archived' ? <strong>ARCHIVED - </strong> : ''
      return (<li key={question.key}><Link to={'/admin/questions/' + question.key + '/responses'}>{archivedTag}{question.prompt.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "")}</Link></li>)
    })
    return (
      <ul>{listItems}</ul>
    )

  };

  render() {
    const { concepts } = this.props
    const { hasreceiveddata } = concepts
    const concept = this.getConcept()
    if (concept) {
      return (
        <div className="admin-container">
          <Link to="admin/concepts">Return to All Concepts</Link>
          <h4 className="title">{concept.displayName}</h4>
          <h6 className="subtitle">{this.questionsForConcept().length} Questions</h6>
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
