import { requestDelete, requestGet, requestPost, requestPut } from '../../../modules/request/index';
import { ConceptFeedback, ConceptFeedbackCollection } from '../interfaces/concept_feedback';

const CONNECT_TYPE = 'connect'

const conceptFeedbackApiBaseUrl = `${process.env.DEFAULT_URL}/api/v1/activity_type/${CONNECT_TYPE}/concept_feedback`;

class ConceptFeedbackApi {
  static getAll(): Promise<ConceptFeedbackCollection> {
    return requestGet(`${conceptFeedbackApiBaseUrl}.json`, null, (error) => {throw(error)});
  }

  static get(uid: string): Promise<ConceptFeedback> {
    return requestGet(`${conceptFeedbackApiBaseUrl}/${uid}.json`, null, (error) => {throw(error)});
  }

  static create(data: ConceptFeedback): Promise<ConceptFeedback> {
    return requestPost(`${conceptFeedbackApiBaseUrl}.json`, {concept_feedback: data}, null, (error) => {throw(error)});
  }

  static update(uid: string, data: ConceptFeedback): Promise<ConceptFeedback> {
    return requestPut(`${conceptFeedbackApiBaseUrl}/${uid}.json`, {concept_feedback: data}, null, (error) => {throw(error)});
  }

  static remove(uid: string): Promise<string> {
    return requestDelete(`${conceptFeedbackApiBaseUrl}/${uid}.json`, null, null, (error) => {throw(error)});
  }
}

export {
  CONNECT_TYPE,
  ConceptFeedbackApi,
  conceptFeedbackApiBaseUrl
};

