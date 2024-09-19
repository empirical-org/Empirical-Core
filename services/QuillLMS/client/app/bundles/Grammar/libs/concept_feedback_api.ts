import { requestDelete, requestGet, requestPost, requestPut } from '../../../modules/request/index';
import { languageToLocale } from '../../Shared';
import { ConceptFeedback, ConceptFeedbackCollection } from '../interfaces/conceptsFeedback';

const GRAMMAR_TYPE = 'grammar'

const conceptFeedbackApiBaseUrl = `${process.env.DEFAULT_URL}/api/v1/activity_type/${GRAMMAR_TYPE}/concept_feedback`;

class ConceptFeedbackApi {
  static getAll(language?: string): Promise<ConceptFeedbackCollection> {
    const language_string = language ? `/translations/${languageToLocale[language]}` : ''
    return requestGet(`${conceptFeedbackApiBaseUrl}${language_string}.json`, null, (error) => { throw (error) });
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
  ConceptFeedbackApi, GRAMMAR_TYPE, conceptFeedbackApiBaseUrl
};

