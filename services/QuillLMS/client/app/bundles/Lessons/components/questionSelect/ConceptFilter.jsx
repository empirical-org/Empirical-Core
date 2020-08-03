import React from 'react'
import { connect } from 'react-redux'
import QuestionSelecter from './QuestionSelecter.jsx'
import C from '../../constants'

let ConceptFilter = ({ dispatch, index, concepts, conceptID, questionType }) => (
  <p className="control is-grouped">
    <span className="select">
      <select
        onChange={e => {
          dispatch({
            type: C.QUESTION_SELECT_MODIFY_QUESTION,
            index,
            questionType,
            data: { conceptID: e.target.value },
          })
        }}
      >
        { concepts.map(concept =>
          (<option
            key={concept.key}
            value={concept.key}
          >
            { concept.name }
          </option>)
        ) }
      </select>
    </span>
    <QuestionSelecter index={index} questionType={questionType} />
  </p>
)

function wellFormedConcepts(state) {
  const allConcepts = state.concepts.data
  return Object.keys(allConcepts).map((key) => {
    return { key, ...allConcepts[key] }
  })
}

function select(state, ownProps) {
  const questionSelecter = state.questionSelect.questions[ownProps.index][ownProps.questionType]
  return {
    conceptID: questionSelecter.conceptID,
    concepts: wellFormedConcepts(state),
  }
}

ConceptFilter = connect(select)(ConceptFilter)
export default ConceptFilter
