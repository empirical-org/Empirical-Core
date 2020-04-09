import { requestDelete, requestGet, requestPost, requestPut } from './request';
import { ConceptFeedback, ConceptFeedbackCollection } from '../interfaces/concept_feedback';

const conceptFeedbackApiBaseUrl = `${process.env.EMPIRICAL_BASE_URL}/api/v1/concept_feedback`;

class ConceptFeedbackApi {
  static getAll(): Promise<ConceptFeedbackCollection> {
    return requestGet(`${conceptFeedbackApiBaseUrl}.json`);
  }

  static get(lesson_type: string, uid: string): Promise<ConceptFeedback> {
    return requestGet(`${conceptFeedbackApiBaseUrl}/${uid}.json`);
  }

  static create(lesson_type: string, data: ConceptFeedback): Promise<ConceptFeedback> {
    return requestPost(`${conceptFeedbackApiBaseUrl}.json`, {lesson: data});
  }

  static update(lesson_type: string, uid: string, data: ConceptFeedback): Promise<ConceptFeedback> {
    return requestPut(`${conceptFeedbackApiBaseUrl}/${uid}.json`, {lesson: data});
  }

  static remove(lesson_type: string, uid: string): Promise<string> {
    return requestDelete(`${conceptFeedbackApiBaseUrl}/${uid}.json`);
  }
}

export {
  ConceptFeedbackApi,
  conceptFeedbackApiBaseUrl
}
