import React from 'react'
import { connect } from 'react-redux'
import QuestionSelecter from './QuestionSelecter.jsx'

let ConceptFilter = ({ dispatch, key, index, concepts, conceptID }) => (
  <p className="control is-grouped">
    <span className="select">
      <select
        onChange={e => {
          dispatch({
            type: 'QUESTION_SELECT.MODIFY_QUESTION',
            key,
            index,
            change: { conceptID: e.target.value },
          })
        }}
      >
        { concepts.map(concept =>
          <option
            value={concept.key}
            key={concept.key}>
            { concept.name }
          </option>
        ) }
      </select>
    </span>
    <QuestionSelecter index={index} />
  </p>
)

function wellFormedConcepts(state) {
  const allConcepts = state.concepts.data
  return Object.keys(allConcepts).map((key) => {
    return { key, ...allConcepts[key] }
  })
}

function select(state, ownProps) {
  const questionSelecter = state.questionSelect.questions[ownProps.index]
  return {
    conceptID: questionSelecter.conceptID,
    concepts: wellFormedConcepts(state),
  }
}

ConceptFilter = connect(select)(ConceptFilter)
export default ConceptFilter
