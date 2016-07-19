import React from 'react'
import { connect } from 'react-redux'
import AddQuestion from './AddQuestion.jsx'
import ConceptFilter from './ConceptFilter.jsx'

const QuestionSelect = ({ questionSelect }) => (
  <div className="columns">
    <div className="column">
      <AddQuestion />
      { questionSelect.map((b, i) =>
        <div key={i}>
          <label className="label">{'Question #' + (i + 1)}</label>
            <ConceptFilter index={i} />
        </div>
      )}
    </div>
  </div>
)

function select(state) {
  return {
    questionSelect: state.questionSelect.questions || [],
  }
}

export default connect(select)(QuestionSelect)
