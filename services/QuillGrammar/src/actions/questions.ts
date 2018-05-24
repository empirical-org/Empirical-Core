import rootRef from '../firebase';
import { ActionTypes } from './actionTypes'
const questionsRef = rootRef.child('questions')
import { Question } from '../interfaces/questions'
import { checkGrammarQuestion, Response } from 'quill-marking-logic'
import { shuffle } from '../helpers/shuffle'
import _ from 'lodash'

// typescript this
export const startListeningToQuestions = (concepts: any) => {
  return function(dispatch) {

    const conceptUIDs = Object.keys(concepts)
    questionsRef.orderByChild('concept_uid').on('value', (snapshot) => {
      const questions = snapshot.val()
      const questionsForConcepts = {}
      Object.keys(questions).map(q => {
        if (conceptUIDs.includes(questions[q].concept_uid)) {
          const question = questions[q]
          question.uid = q
          if (questionsForConcepts.hasOwnProperty(question.concept_uid)) {
            // console.log(questionsForConcepts[question.concept_uid])
            questionsForConcepts[question.concept_uid] = questionsForConcepts[question.concept_uid].concat(question)
          } else {
            questionsForConcepts[question.concept_uid] = [question]
          }
        }
      })

      const arrayOfQuestions = []
      Object.keys(questionsForConcepts).forEach(conceptUID => {
        const shuffledQuestionArray = shuffle(questionsForConcepts[conceptUID])
        const numberOfQuestions = concepts[conceptUID].quantity
        arrayOfQuestions.push(shuffledQuestionArray.slice(0, numberOfQuestions))
      })
      const flattenedArrayOfQuestions = _.flatten(arrayOfQuestions)
      if (flattenedArrayOfQuestions.length > 0) {
        dispatch({ type: ActionTypes.RECEIVE_QUESTION_DATA, data: flattenedArrayOfQuestions, });
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
        feedback: "<b>Well done!</b> That's the correct answer.",
        concept_results: [{
          conceptUID: question.concept_uid,
          correct: true
        }]
      }
    })
    const responseObj = checkGrammarQuestion(questionUID, response, formattedAnswers)
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
