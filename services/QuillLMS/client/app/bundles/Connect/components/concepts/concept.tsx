import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import _ from 'underscore'

import { hashToCollection, Spinner } from '../../../Shared/index'

export const Concept = ({ concepts, match, questions, fillInBlank }) => {

  function getConcept() {
    const { data } = concepts
    const { params } = match
    const { conceptID } = params
    return _.find(data['0'], {uid: conceptID})
  };

  function getQuestionsForConcept() {
    const { data } = questions
    const { params } = match
    const { conceptID } = params
    const questionsCollection = hashToCollection(data)
    const fillInBlankCollection = hashToCollection(fillInBlank.data);
    const allQuestions = questionsCollection.concat(fillInBlankCollection);
    const filteredQuestions = allQuestions.filter(question => question.conceptID === conceptID && question.flag !== 'archived')
    return filteredQuestions
  };

  function renderQuestionsForConcept() {
    const questionsForConcept = getQuestionsForConcept()
    const listItems = questionsForConcept.map((question) => {
      const { key, flag, prompt } = question
      const archivedTag = flag === 'archived' ? <strong>ARCHIVED - </strong> : ''
      return (
        <li key={key}>
          <Link to={'/admin/questions/' + key + '/responses'}>{archivedTag}{prompt.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "")}</Link>
        </li>
      )
    })
    return <ul>{listItems}</ul>
  };

  const { hasreceiveddata } = concepts
  const concept = getConcept()

  if(hasreceiveddata === false) {
    return <Spinner/>
  }
  if (concept) {
    return (
      <div className="admin-container">
        <Link to="admin/concepts">Return to All Concepts</Link>
        <h4 className="title">{concept.displayName}</h4>
        <h6 className="subtitle">{getQuestionsForConcept().length} Questions</h6>
        {renderQuestionsForConcept()}
      </div>
    )
  }
  return (
    <p>404: No Concept Found</p>
  )
}

function select(state) {
  return {
    concepts: state.concepts,
    questions: state.questions,
    fillInBlank: state.fillInBlank,
    itemLevels: state.itemLevels,
    routing: state.routing
  }
}

export default connect(select)(Concept)
