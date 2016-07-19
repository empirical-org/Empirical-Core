import React from 'react'
import _ from 'underscore'
import { hashToCollection } from '../../libs/hashToCollection'
import { connect } from 'react-redux'

let QuestionSelecter = ({ dispatch, key, index, questions, questionID }) => (
  questions.length > 0 ?
    <span className="select">
      <select
        onChange={e => {
          dispatch({
            type: 'QUESTION_SELECT.MODIFY_QUESTION',
            key,
            index,
            change: { questionID: e.target.value },
          })
        }}
        value={questionID}
      >
        {questions.map(question =>
          <option
            value={question.key}
            key={question.key}
          >
            { question.prompt }
          </option>
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
  const questionSelecter = state.questionSelect.questions[ownProps.index]
  const questions = questionsForConcept(state.questions.data, questionSelecter.conceptID)
  return {
    questions,
    questionID: questionSelecter.questionID,
  }
}

QuestionSelecter = connect(select)(QuestionSelecter)
export default QuestionSelecter
