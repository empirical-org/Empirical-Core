import React from 'react'
import { connect } from 'react-redux'

let AddQuestion = ({ dispatch, conceptID, questionType, index, buttonClass,
                     text, actionType }) => (
  <button
    className={"button " + buttonClass}
    onClick={e => {
      dispatch({
        type: 'QUESTION_SELECT.' + (actionType || 'ADD_QUESTION'),
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
