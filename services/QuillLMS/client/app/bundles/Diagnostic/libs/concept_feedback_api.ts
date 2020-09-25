import { requestDelete, requestGet, requestPost, requestPut } from './request';

import { ConceptFeedback, ConceptFeedbackCollection } from '../interfaces/concept_feedback';

const CONNECT_TYPE = 'connect'

const conceptFeedbackApiBaseUrl = `${process.env.DEFAULT_URL}/api/v1/concept_feedback`;

class ConceptFeedbackApi {
  static getAll(): Promise<ConceptFeedbackCollection> {
    return requestGet(`${conceptFeedbackApiBaseUrl}.json?activity_type=${CONNECT_TYPE}`);
  }

  static get(uid: string): Promise<ConceptFeedback> {
    return requestGet(`${conceptFeedbackApiBaseUrl}/${uid}.json?activity_type=${CONNECT_TYPE}`);
  }

  static create(data: ConceptFeedback): Promise<ConceptFeedback> {
    return requestPost(`${conceptFeedbackApiBaseUrl}.json?activity_type=${CONNECT_TYPE}`, {concept_feedback: data});
  }

  static update(uid: string, data: ConceptFeedback): Promise<ConceptFeedback> {
    return requestPut(`${conceptFeedbackApiBaseUrl}/${uid}.json?activity_type=${CONNECT_TYPE}`, {concept_feedback: data});
  }

  static remove(uid: string): Promise<string> {
    return requestDelete(`${conceptFeedbackApiBaseUrl}/${uid}.json?activity_type=${CONNECT_TYPE}`);
  }
}

export {
  ConceptFeedbackApi,
  conceptFeedbackApiBaseUrl,
  CONNECT_TYPE
}
