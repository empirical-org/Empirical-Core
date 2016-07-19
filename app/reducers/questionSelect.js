export default function(state = { questions: [] }, action) {
  let questions
  switch(action.type) {
    case 'QUESTION_SELECT.ADD_QUESTION':
      questions = state.questions || []
      return {
        ...state,
        questions: questions.concat(action.data)
      }
    case 'QUESTION_SELECT.MODIFY_QUESTION':
      questions = state.questions
      questions[action.index] = {
        ...questions[action.index],
        ...action.change
      }
      return {
        ...state,
        questions: questions
      }
    default:
      return state
  }
}
