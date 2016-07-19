import React from 'react'
import { connect } from 'react-redux'

let AddQuestion = ({ dispatch, key, conceptID }) => (
  <button
    className="button is-primary"
    onClick={e => {
      dispatch({
        type: 'QUESTION_SELECT.ADD_QUESTION',
        data: { conceptID, questionID: null }
      })
    }}
  >
    &#43; Add question
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
