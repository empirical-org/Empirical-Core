import C from '../constants'

export default function(state = { questions: [] }, action) {
  let questions
  switch(action.type) {
    case C.QUESTION_SELECT_UPDATE_TITLE:
      return {
        ...state,
        title: action.title,
      }
    case C.QUESTION_SELECT_ADD_QUESTION:
      questions = state.questions || []
      return {
        ...state,
        questions: questions.concat({ [action.questionType]: action.data })
      }
    case C.QUESTION_SELECT_MODIFY_QUESTION:
      questions = state.questions
      const data = {
        ...questions[action.index][action.questionType],
        ...action.data
      }
      questions[action.index] = {
        ...questions[action.index],
        [action.questionType]: data
      }
      return {
        ...state,
        questions: questions
      }
    default:
      return state
  }
}
