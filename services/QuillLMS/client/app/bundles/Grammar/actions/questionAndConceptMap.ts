import * as _ from 'lodash'

import { hashToCollection } from '../../Shared/index'
import { Concept } from '../interfaces/concepts'
import { DashboardActivity, DashboardConceptRow, DashboardQuestionRow } from '../interfaces/dashboards'
import { GrammarActivity } from '../interfaces/grammarActivities'
import { SharedCacheApi } from '../libs/shared_cache_api'
import { ActionTypes } from './actionTypes'

export const SHARED_CACHE_KEY = 'GRAMMAR_QUESTIONS_AND_CONCEPTS_MAP'


export function startListeningToQuestionAndConceptMapData() {
  return function (dispatch: Function) {
    SharedCacheApi.get(SHARED_CACHE_KEY).then((data) => {
      dispatch({ type: ActionTypes.RECEIVE_GRAMMAR_QUESTION_AND_CONCEPT_MAP, data: data, });
    })
  };
}

export function updateData() {
  return function (dispatch: Function, getState: Function) {
    const { concepts, questions, grammarActivities, } = getState()
    const conceptsArray = concepts.data[0]
    const questionsArray = hashToCollection(questions.data)
    const activitiesArray = hashToCollection(grammarActivities.data)
    const questionRows: Array<DashboardQuestionRow> = questionsArray.map((q) => {
      const questionRow:DashboardQuestionRow = {}
      questionRow.concept_uid = q.concept_uid
      questionRow.prompt = q.prompt
      questionRow.flag = q.flag
      questionRow.link = `/#/admin/questions/${q.key}/responses`
      const concept = conceptsArray.find((c: Concept) => c.uid === q.concept_uid)
      questionRow.concept = concept ? { name: concept.displayName, link: `/#/admin/concepts/${concept.uid}`} : {}
      const explicitlyAssignedActivities:Array<{title: string, flag: string, link: string}> = []
      const implicitlyAssignedActivities:Array<{title: string, flag: string, link: string}> = []
      activitiesArray.forEach((act: GrammarActivity) => {
        const actObj = _.pickBy({
          title: act.title || 'No Name',
          flag: act.flag,
          link: `/#/admin/lessons/${act.key}/`
        })
        if (act.questions && act.questions.find(aq => aq.key === q.key)) {
          explicitlyAssignedActivities.push(actObj)
        } else if (act.concepts && Object.keys(act.concepts).includes(q.concept_uid)) {
          implicitlyAssignedActivities.push(actObj)
        }
      })
      questionRow.noActivities = !(explicitlyAssignedActivities.length || implicitlyAssignedActivities.length)
      questionRow.explicitlyAssignedActivities = explicitlyAssignedActivities
      questionRow.implicitlyAssignedActivities = implicitlyAssignedActivities
      return removeNullAndUndefinedValues(questionRow)
    })

    const groupedConcepts = _.groupBy(questionRows, 'concept_uid')
    const conceptRows = Object.keys(groupedConcepts).map(uid => {
      const associatedQuestions = groupedConcepts[uid]
      const conceptRow:DashboardConceptRow = {}
      conceptRow.link = associatedQuestions[0].concept.link || ''
      conceptRow.name = associatedQuestions[0].concept.name || 'Missing Concept'
      let explicitlyAssignedActivities:Array<DashboardActivity> = []
      let implicitlyAssignedActivities:Array<DashboardActivity> = []
      associatedQuestions.forEach(q => {
        // explicit and implicitly assigned activities are inverted for questions and concepts
        // because if a concept is explicitly associated, its questions are implicitly associated, and vice versa
        explicitlyAssignedActivities = explicitlyAssignedActivities.concat(q.implicitlyAssignedActivities)
        implicitlyAssignedActivities = implicitlyAssignedActivities.concat(q.explicitlyAssignedActivities)
      })
      const uniqueExplicitlyAssignedActivityLinks = Array.from(new Set(explicitlyAssignedActivities.map(a => a.link)))
      const uniqueExplicitlyAssignedActivities = uniqueExplicitlyAssignedActivityLinks.map(link => explicitlyAssignedActivities.find(act => act.link === link))
      const uniqueImplicitlyAssignedActivityLinks = Array.from(new Set(implicitlyAssignedActivities.map(a => a.link)))
      const uniqueImplicitlyAssignedActivities = uniqueImplicitlyAssignedActivityLinks.map(link => implicitlyAssignedActivities.find(act => act.link === link))
      conceptRow.explicitlyAssignedActivities = uniqueExplicitlyAssignedActivities
      conceptRow.implicitlyAssignedActivities = uniqueImplicitlyAssignedActivities
      return removeNullAndUndefinedValues(conceptRow)
    })
    SharedCacheApi.update(SHARED_CACHE_KEY, {
      questionRows: questionRows,
      conceptRows: conceptRows
    }).then(() => {
      dispatch(startListeningToQuestionAndConceptMapData())
    })
  }
}

export function checkTimeout() {
  return function (dispatch: Function) {
    SharedCacheApi.get(SHARED_CACHE_KEY).then((result) => {
      dispatch(startListeningToQuestionAndConceptMapData())
    }).catch((response) => {
      if (response.status == 404) {
        dispatch(updateData())
      }
    })
  };
}

function removeNullAndUndefinedValues(obj: any) {
  Object.keys(obj).forEach((key: any) => {
    if ([undefined, null].includes(obj[key])) {
      delete obj[key]
    }
  })
  return obj
}
