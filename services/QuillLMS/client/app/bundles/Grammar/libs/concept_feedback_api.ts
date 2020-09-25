import { requestDelete, requestGet, requestPost, requestPut } from './request';

import { ConceptFeedback, ConceptFeedbackCollection } from '../interfaces/conceptsFeedback';

const GRAMMAR_TYPE = 'grammar'

const conceptFeedbackApiBaseUrl = `${process.env.DEFAULT_URL}/api/v1/concept_feedback`;

class ConceptFeedbackApi {
  static getAll(): Promise<ConceptFeedbackCollection> {
    return requestGet(`${conceptFeedbackApiBaseUrl}.json?activity_type=${GRAMMAR_TYPE}`);
  }

  static get(uid: string): Promise<ConceptFeedback> {
    return requestGet(`${conceptFeedbackApiBaseUrl}/${uid}.json?activity_type=${GRAMMAR_TYPE}`);
  }

  static create(data: ConceptFeedback): Promise<ConceptFeedback> {
    return requestPost(`${conceptFeedbackApiBaseUrl}.json?activity_type=${GRAMMAR_TYPE}`, {concept_feedback: data});
  }

  static update(uid: string, data: ConceptFeedback): Promise<ConceptFeedback> {
    return requestPut(`${conceptFeedbackApiBaseUrl}/${uid}.json?activity_type=${GRAMMAR_TYPE}`, {concept_feedback: data});
  }

  static remove(uid: string): Promise<string> {
    return requestDelete(`${conceptFeedbackApiBaseUrl}/${uid}.json?activity_type=${GRAMMAR_TYPE}`);
  }
}

export {
  ConceptFeedbackApi,
  conceptFeedbackApiBaseUrl,
  GRAMMAR_TYPE
}
