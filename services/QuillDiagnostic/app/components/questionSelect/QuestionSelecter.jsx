import React from 'react'
import _ from 'underscore'
import { hashToCollection } from 'quill-component-library/dist/componentLibrary'
import { connect } from 'react-redux'
import C from '../../constants'

let QuestionSelecter = ({ dispatch, index, questions, questionID, questionType }) => (
  questions.length > 0 ?
    <span className="select">
      <select
        onChange={e => {
          dispatch({
            type: C.QUESTION_SELECT_MODIFY_QUESTION,
            index,
            questionType,
            data: { questionID: e.target.value },
          })
        }}
        value={questionID}
      >
        {questions.map(question =>
          (<option
            key={question.key}
            value={question.key}
          >
            { question.prompt }
          </option>)
        )}
      </select>
    </span>
  : <span>No questions found for this concept.</span>
)

function questionsForConcept(allQuestions, conceptID) {
  const questionsCollection = hashToCollection(allQuestions)
  return _.where(questionsCollection, { conceptID })
}

function select(state, ownProps) {
  const questionSelecter = state.questionSelect.questions[ownProps.index][ownProps.questionType]
  const questions = questionsForConcept(state.questions.data, questionSelecter.conceptID)
  return {
    questions,
    questionID: questionSelecter.questionID,
  }
}

QuestionSelecter = connect(select)(QuestionSelecter)
export default QuestionSelecter
