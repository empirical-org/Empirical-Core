import React from 'react'
import { connect } from 'react-redux'
import C from '../../constants'

let AddQuestion = ({ dispatch, conceptID, questionType, index, text, actionType }) => (
  <button
    className="button"
    onClick={e => {
      dispatch({
        type: actionType || C.QUESTION_SELECT_ADD_QUESTION,
        questionType,
        index,
        data: { conceptID, questionID: null }
      })
    }}
  >
    <span>&#43; { text || 'Add question' }</span>
  </button>
)

function wellFormedConcepts(state) {
  const allConcepts = state.concepts.data
  return Object.keys(allConcepts).map((key) => {
    return { key, ...allConcepts[key] }
  })
}

function propsFromState(state) {
  const concepts = wellFormedConcepts(state)
  return {
    conceptID: concepts[0].key
  }
}

AddQuestion = connect(propsFromState)(AddQuestion)
export default AddQuestion
