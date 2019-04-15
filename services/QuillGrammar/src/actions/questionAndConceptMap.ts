import rootRef from '../firebase';
import { ActionTypes } from './actionTypes'
import { hashToCollection } from 'quill-component-library/dist/componentLibrary'

const	grammarQuestionsAndConceptsRef = rootRef.child('grammarQuestionsAndConceptsMap');
const setTimeoutRef = rootRef.child('timeouts/grammarQuestionsAndConceptsMap');

const moment = require('moment');

interface QuestionRow {
  prompt: string,
  flag: string,
  link: string,
  concept_uid: string,
  concept: { name: string, link: string, },
  explicitlyAssignedActivities: Array<{title: string, flag: string, link: string}>,
  implicitlyAssignedActivities: Array<{title: string, flag: string, link: string}>,
  noActivities: boolean,
}

export function startListeningToQuestionAndConceptMapData() {
  return function (dispatch: Function) {
    grammarQuestionsAndConceptsRef.on('value', (snapshot: any) => {
      dispatch({ type: ActionTypes.RECEIVE_GRAMMAR_QUESTION_AND_CONCEPT_MAP, data: snapshot.val(), });
    });
  };
}

export function updateData() {
  return function (dispatch: Function, getState: Function) {
    const { concepts, questions, lessons, } = getState()
    const conceptsArray = concepts.data[0]
    const questionsArray = hashToCollection(questions.data)
    const activitiesArray = hashToCollection(lessons.data)
    const questionRows: Array<QuestionRow> = questionsArray.map((q) => {
      const questionRow: QuestionRow = {}
      questionRow.concept_uid = q.concept_uid
      questionRow.prompt = q.prompt
      questionRow.flag = q.flag
      questionRow.link = `/#/admin/questions/${q.key}/responses`
      const concept = conceptsArray.find(c => c.uid === q.concept_uid)
      questionRow.concept = { name: concept.displayName, link: `/#/admin/concepts/${concept.uid}`}
      const explicitlyAssignedActivities:Array<{title: string, flag: string, link: string}> = []
      const implicitlyAssignedActivities:Array<{title: string, flag: string, link: string}> = []
      activitiesArray.forEach(act => {
        const actObj = {
          title: act.title,
          flag: act.flag,
          link: `/#/admin/lessons/${act.key}/`
        }
        if (act.questions && act.questions.find(aq => aq.key === q.key)) {
          explicitlyAssignedActivities.push(actObj)
        } else if (act.concepts && Object.keys(act.concepts).includes(q.concept_uid)) {
          implicitlyAssignedActivities.push(actObj)
        }
      })
      questionRow.noActivities = !!(explicitlyAssignedActivities.length || implicitlyAssignedActivities.length)
      questionRow.explicitlyAssignedActivities = explicitlyAssignedActivities
      questionRow.implicitlyAssignedActivities = implicitlyAssignedActivities
      return questionRow
    })
    const conceptRows = _.groupBy(questionRows, 'concept_uid')
    debugger;
    grammarQuestionsAndConceptsRef.child('questionRows').set(questionRows)
    grammarQuestionsAndConceptsRef.child('conceptRows').set(conceptRows)
  }
}

export function checkTimeout() {
  setTimeoutRef.on('value', (snapshot: any) => {
    console.log('time now: ', moment().format('x'));
    console.log('time at snapshot: ', snapshot.val());
    if (moment().format('x') - (snapshot.val() || 0) > 1) {
    // if (moment().format('x') - (snapshot.val() || 0) > 300000) {
      setTimeoutRef.set(moment().format('x'));
      return function (dispatch: Function) {
        dispatch(updateData)
      }
    }
  });
}
