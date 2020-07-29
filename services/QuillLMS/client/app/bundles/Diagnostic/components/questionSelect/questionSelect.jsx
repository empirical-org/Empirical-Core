import React from 'react'
import { connect } from 'react-redux'
import AddQuestion from './AddQuestion.jsx'
import ConceptFilter from './ConceptFilter.jsx'
import C from '../../constants'

const QuestionSelect = ({ questionSelect, showSubQuestions }) => (
  <div className="columns">
    <div className="column">
      { questionSelect.map((b, i) =>
        (<div
          key={i}
          style={{
          borderBottom: '1px solid #aaa',
          marginBottom: 10,
          paddingBottom: 10,
        }}
        >
          <label className="label">{'Question #' + (i + 1)}</label>
          <ConceptFilter index={i} questionType={'initial'} />
          { showSubQuestions ?
            ['optimal', 'suboptimal'].map(type =>
              b[type] ?
                <div style={{marginLeft: 10}}>
                  <label className="label">{'If answer is ' + type + ':'}</label>
                  <ConceptFilter index={i} questionType={type} />
                </div>
              : <AddQuestion
                actionType={C.QUESTION_SELECT_MODIFY_QUESTION}
                index={i}
                questionType={type}
                text={'Add ' +  type + ' question'}
              />
            )
          : ''}
        </div>)
      )}
      <AddQuestion questionType={'initial'} />
    </div>
  </div>
)

function select(state) {
  return {
    questionSelect: state.questionSelect.questions || [],
    // Small hack to get the display to rerender since things are pretty nested
    questionTypes: state.questionSelect.questions.map(q => Object.keys(q))
  }
}

export default connect(select)(QuestionSelect)
