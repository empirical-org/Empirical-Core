export default function(state = { questions: [] }, action) {
  let questions
  switch(action.type) {
    case 'QUESTION_SELECT.ADD_QUESTION':
      questions = state.questions || []
      return {
        ...state,
        questions: questions.concat({ [action.questionType]: action.data })
      }
    case 'QUESTION_SELECT.MODIFY_QUESTION':
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
