import rootRef from '../firebase';
import { ActionTypes } from './actionTypes'
const questionsRef = rootRef.child('questions')
import { Question } from '../interfaces/questions'
import { checkGrammarQuestion, Response } from 'quill-marking-logic'

export const startListeningToQuestions = (conceptUIDs: Array[string]) => {
  return function(dispatch) {

    questionsRef.orderByChild('concept_uid').on('value', (snapshot) => {
      const questions = snapshot.val()
      const questionsForConcepts:Array<Question> = []
      Object.keys(questions).map(q => {
        if (conceptUIDs.includes(questions[q].concept_uid)) {
          const question = questions[q]
          question.uid = q
          questionsForConcepts.push(question)
        }
      })
      if (questionsForConcepts.length > 0) {
        dispatch({ type: ActionTypes.RECEIVE_QUESTION_DATA, data: questionsForConcepts, });
      } else {
        dispatch({ type: ActionTypes.NO_QUESTIONS_FOUND})
      }
    });

  }
}

export const checkAnswer = (response:string, question:Question) => {
  return function(dispatch) {
    const questionUID: string = question.uid
    const formattedAnswers: Array<any> = question.answers.map(a => {
      return {
        optimal: true,
        count: 1,
        text: a.text.replace(/{|}/gm, ''),
        question_uid: questionUID,
        feedback: "<b>Well done!</b> That's the correct answer."
      }
    })
    const responseObj = checkGrammarQuestion(questionUID, response, formattedAnswers)
    console.log(responseObj)
    dispatch(submitResponse(responseObj))
  }
}

export const goToNextQuestion = () => {
  return function(dispatch) {
    dispatch({ type: ActionTypes.GO_T0_NEXT_QUESTION })
  }
}

export const submitResponse = (response: Response) => {
  return function(dispatch) {
    dispatch({ type: ActionTypes.SUBMIT_RESPONSE, response })
  }
}
