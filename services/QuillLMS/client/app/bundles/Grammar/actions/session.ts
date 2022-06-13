import _ from 'lodash';
import { checkGrammarQuestion, Response } from 'quill-marking-logic'

import { ActionTypes } from './actionTypes'
import * as responseActions from './responses'

import { QuestionApi, GRAMMAR_QUESTION_TYPE } from '../libs/questions_api'
import { SessionApi } from '../libs/sessions_api'
import { Question } from '../interfaces/questions'
import { SessionState } from '../reducers/sessionReducer'
import { shuffle } from '../helpers/shuffle';
import { permittedFlag } from '../helpers/flagArray'
import { hashToCollection } from '../../Shared/index'

export const allQuestions = {};
let questionsInitialized = false;

export const populateQuestions = (questions: object, forceRefresh: boolean) => {
  if (questionsInitialized && !forceRefresh) return;
  Object.keys(questions).forEach((uid) => {
    questions[uid].uid = uid
    allQuestions[uid] = questions[uid]
  })
  questionsInitialized = true;
}

export const updateSession = (sessionID: string, session: SessionState) => {
  const normalizedSession = normalizeSession(session)
  const cleanedSession = _.pickBy(normalizedSession)
  if (!cleanedSession.error) {
    SessionApi.update(sessionID, cleanedSession)
  }
}

export const setSessionReducerToSavedSession = (sessionID: string) => {
  return dispatch => {
    SessionApi.get(sessionID).then((session) => {
      const denormalizedSession = denormalizeSession(session)
      dispatch(handleGrammarSession(denormalizedSession))
    }).catch((error) => {
      if (error.status === 404) {
        dispatch(startNewSession())
      } else {
        throw error
      }
    })
  }
}

export const denormalizeSession = (session: object): object => {
  // Normalized unanswered questions, if present, are just strings containing keys,
  // if there's a non-string value, then this session must be denormalized already
  const unansweredCheck = (
    session.unansweredQuestions.length &&
    typeof session.unansweredQuestions[0] == "object"
  )
  // Normalized answered questions have only two keys: "question" and "attempts".
  // The presence of the standard "uid" key means that the session is denormalized
  const answeredCheck = (
    session.answeredQuestions.length &&
    session.answeredQuestions[0].uid
  )
  // If the session is already in a denormalized form (determined by checking if
  // either answered or unanswered questions, one of which is guaranteed to be
  // present, is denormalized) then just return it as-is
  if (unansweredCheck || answeredCheck) return session
  // If someone has answered no questions, this key will be missing
  if (session.answeredQuestions) {
    session.answeredQuestions.forEach((value, index, answeredQuestions) => {
      answeredQuestions[index] = denormalizeQuestion(value);
    });
  }
  // If all questions are answered, we won't have this key
  if (session.unansweredQuestions) {
    session.unansweredQuestions.forEach((value, index, unansweredQuestions) => {
      unansweredQuestions[index] = denormalizeQuestion(value);
    });
  }
  if (session.currentQuestion) {
    session.currentQuestion = denormalizeQuestion(session.currentQuestion);
  }
  return session
}

const denormalizeQuestion = (question: string | object): object => {
  // Questions stored on the session object have a different shape
  // if they have any attempt data attached to them
  // It appears that they also have this shape if the object has ever
  // had attempt data on it.  This is only happens with currentQuestion,
  // but we should account for it
  const questionUid = (question.attempts || question.question) ? question.question : question;
  // We need to make sure that the 'question' part of the
  // question object is a clean copy so that we can modify
  // it without changing the cached question object
  const denormalizedQuestion = JSON.parse(JSON.stringify(allQuestions[questionUid]))
  if (question.attempts) {
    denormalizedQuestion.attempts = question.attempts;
  }
  return denormalizedQuestion
}

export const normalizeSession = (session: object): object => {
  // Deep copy so that we return a clean object
  let sessionCopy = JSON.parse(JSON.stringify(session));
  // If someone has answered all the questions, key will be missing
  if (sessionCopy.unansweredQuestions) {
    sessionCopy.unansweredQuestions = sessionCopy.unansweredQuestions.map(normalizeQuestion)
  }
  if (sessionCopy.currentQuestion) {
    sessionCopy.currentQuestion = normalizeQuestionWithAttempts(sessionCopy.currentQuestion);
  }
  // If someone has not answered any questions, this key will be missing
  if (sessionCopy.answeredQuestions) {
    sessionCopy.answeredQuestions = sessionCopy.answeredQuestions.map(normalizeQuestionWithAttempts)
  }
  return sessionCopy
}

const normalizeQuestion = (question: object): string => {
  return question.uid;
}

const normalizeQuestionWithAttempts = (question: object): object => {
  return {
    question: question.uid,
    attempts: question.attempts,
  }
}

const handleGrammarSession = (session) => {
  return dispatch => {
    if (session && Object.keys(session).length > 1 && !session.error) {
      QuestionApi.getAll(GRAMMAR_QUESTION_TYPE).then((allQuestions) => {
        if (session.currentQuestion) {
          if (!session.currentQuestion.prompt || !session.currentQuestion.answers) {
            const currentQuestion = allQuestions[session.currentQuestion.uid]
            currentQuestion.uid = session.currentQuestion.uid
            session.currentQuestion = currentQuestion
          }
        }
        if (session.unansweredQuestions) {
          session.unansweredQuestions = session.unansweredQuestions.map((q) => {
            if (q.prompt && q.answers && q.uid) {
              return q
            } else {
              const question = allQuestions[q.uid]
              question.uid = q.uid
              return question
            }
          })
        }
        dispatch(setSessionReducer(session))
      })
    } else {
      dispatch(setSessionPending(false))
    }
  }
}

export const startListeningToFollowUpQuestionsForProofreaderSession = (proofreaderSessionID: string) => {
  return (dispatch, getState) => {
    // All sessions are stored in the same table in the LMS, so we can use the same APIs to access them
    SessionApi.get(proofreaderSessionID).then((proofreaderSession) => {
      dispatch(handleProofreaderSession(proofreaderSession, getState()))
    })
  }
}

const handleProofreaderSession = (proofreaderSession, state) => {
  return dispatch => {

    // if there is no proofreader session or concept results for that session, we can't do anything here
    // if there are already answered questions or the session is already in the state
    // that all gets processed by the normal `setSessionReducerToSavedSession` function and we don't need to set new ones
    if (!proofreaderSession || !proofreaderSession.conceptResults || proofreaderSession.answeredQuestions || state.session.proofreaderSession) { return }

    const concepts: { [key: string]: { quantity: 1|2|3 } } = {}
    const incorrectConcepts = proofreaderSession.conceptResults.filter(cr => cr.metadata.correct === 0)
    let quantity = 3
    if (incorrectConcepts.length > 9) {
      quantity = 1
    } else if (incorrectConcepts.length > 4) {
      quantity = 2
    }
    proofreaderSession.conceptResults.forEach(cr => {
      if (cr.metadata.correct === 0) {
        concepts[cr.concept_uid] = { quantity }
      }
    })
    dispatch(saveProofreaderSessionToReducer(proofreaderSession))
    dispatch(getQuestionsForConcepts(concepts, 'production'))
  }
}

// typescript this
export const getQuestionsForConcepts = (concepts: any, flag: string) => {
  return (dispatch, getState) => {
    dispatch(setSessionPending(true))
    const conceptUIDs = Object.keys(concepts)
    QuestionApi.getAll(GRAMMAR_QUESTION_TYPE).then((questions) => {
      const questionsForConcepts = {}
      Object.keys(questions).map(q => {
        if (conceptUIDs.includes(questions[q].concept_uid) && questions[q].prompt && questions[q].answers && permittedFlag(flag, questions[q].flag)) {
          const question = questions[q]
          question.uid = q
          if (questionsForConcepts.hasOwnProperty(question.concept_uid)) {
            questionsForConcepts[question.concept_uid] = questionsForConcepts[question.concept_uid].concat(question)
          } else {
            questionsForConcepts[question.concept_uid] = [question]
          }
        }
      })

      const arrayOfQuestions = []
      Object.keys(questionsForConcepts).forEach(conceptUID => {
        const shuffledQuestionArray = shuffle(questionsForConcepts[conceptUID])
        const numberOfQuestions = shuffledQuestionArray.length >= concepts[conceptUID].quantity ? concepts[conceptUID].quantity : shuffledQuestionArray.length
        arrayOfQuestions.push(shuffledQuestionArray.slice(0, numberOfQuestions))
      })

      const flattenedArrayOfQuestions = shuffle(_.flatten(arrayOfQuestions))
      if (flattenedArrayOfQuestions.length > 0) {
        dispatch({ type: ActionTypes.RECEIVE_QUESTION_DATA, data: flattenedArrayOfQuestions, });
      } else {
        // we should only show no questions error if it is not a proofreader follow-up
        if (getState().session.proofreaderSession) {
          dispatch({ type: ActionTypes.RECEIVE_QUESTION_DATA, data: [] });
        } else {
          dispatch({ type: ActionTypes.NO_QUESTIONS_FOUND_FOR_SESSION})
        }
      }
      dispatch(setSessionPending(false))
    });

  }
}

export const getQuestions = (questions: any, flag: string) => {
  return dispatch => {
    dispatch(setSessionPending(true))
    QuestionApi.getAll(GRAMMAR_QUESTION_TYPE).then((allQuestions) => {
      const arrayOfQuestions = questions.map(q => {
        const question = allQuestions[q.key]
        question.uid = q.key
        return question
      })
      const arrayOfQuestionsFilteredByFlag = arrayOfQuestions.filter(q => permittedFlag(flag, q.flag))
      if (arrayOfQuestionsFilteredByFlag.length > 0) {
        dispatch({ type: ActionTypes.RECEIVE_QUESTION_DATA, data: arrayOfQuestionsFilteredByFlag, });
      } else {
        dispatch({ type: ActionTypes.NO_QUESTIONS_FOUND_FOR_SESSION})
      }
      dispatch(setSessionPending(false))
    })
  }
}

export const checkAnswer = (response: string, question: Question, responses: Response[], isFirstAttempt: Boolean) => {
  return dispatch => {
    const questionUID: string = question.uid
    const focusPoints = question.focusPoints ? hashToCollection(question.focusPoints).sort((a, b) => a.order - b.order) : [];
    const incorrectSequences = question.incorrectSequences ? hashToCollection(question.incorrectSequences) : [];
    const defaultConceptUID = question.modelConceptUID || question.concept_uid
    const responseObj = checkGrammarQuestion(questionUID, response, responses, focusPoints, incorrectSequences, defaultConceptUID)
    responseObj.feedback = responseObj.feedback && responseObj.feedback !== '<br/>' ? responseObj.feedback : "Try again! Unfortunately, that answer is not correct."
    dispatch(responseActions.submitResponse(responseObj, null, isFirstAttempt))
    delete responseObj.parent_id
    dispatch(submitResponse(responseObj))
  }
}

export const goToNextQuestion = () => {
  return dispatch => {
    dispatch({ type: ActionTypes.GO_T0_NEXT_QUESTION })
  }
}

export const submitResponse = (response: Response) => {
  return dispatch => {
    dispatch({ type: ActionTypes.SUBMIT_RESPONSE, response })
  }
}

export const setSessionReducer = (session: SessionState) => {
  return dispatch => {
    dispatch({ type: ActionTypes.SET_SESSION, session})
  }
}

export const saveProofreaderSessionToReducer = (proofreaderSession) => {
  return dispatch => {
    dispatch({ type: ActionTypes.SET_PROOFREADER_SESSION_TO_REDUCER, data: proofreaderSession})
  }
}

export const setSessionPending = (pendingStatus: boolean) => {
  return dispatch => {
    dispatch({ type: ActionTypes.SET_SESSION_PENDING, pending: pendingStatus })
  }
}

export const startNewSession = () => {
  return (dispatch) => {
    dispatch({ type: ActionTypes.START_NEW_SESSION, })
    dispatch({ type: ActionTypes.START_NEW_ACTIVITY, })
  }
}

export const setCurrentQuestion = (question: Question) => {
  return dispatch => {
    dispatch({ type: ActionTypes.SET_CURRENT_QUESTION, question })
  }
}
