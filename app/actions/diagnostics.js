import C from "../constants"
import rootRef from "../libs/firebase"
import { push } from 'react-router-redux'

const conceptsRef = rootRef.child("concepts")

export function submitDiagnostic() {
  return (dispatch, getState) => {
    const questions = getState().questionSelect.questions.map(q => (
      {
        initial: q.initial && q.initial.questionID,
        optimal: q.optimal && q.optimal.questionID,
        suboptimal: q.suboptimal && q.suboptimal.questionID,
      }
    ))

    console.log(questions)
    // TODO write to database
  }
}
