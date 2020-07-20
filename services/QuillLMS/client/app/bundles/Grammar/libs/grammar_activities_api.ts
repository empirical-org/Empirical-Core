import { requestDelete, requestGet, requestPost, requestPut } from './request';
import { GrammarActivities, GrammarActivity } from '../interfaces/grammarActivities'

const grammarActivityApiBaseUrl = `${process.env.DEFAULT_URL}/api/v1/lessons`;

const TYPE_GRAMMAR_ACTIVITY = 'grammar_activity'

class GrammarActivityApi {
  static getAll(): Promise<GrammarActivities> {
    return requestGet(`${grammarActivityApiBaseUrl}.json?lesson_type=${TYPE_GRAMMAR_ACTIVITY}`);
  }

  static get(uid: string): Promise<GrammarActivity> {
    return requestGet(`${grammarActivityApiBaseUrl}/${uid}.json`);
  }

  static create(data: GrammarActivity): Promise<GrammarActivity> {
    return requestPost(`${grammarActivityApiBaseUrl}.json?lesson_type=${TYPE_GRAMMAR_ACTIVITY}`, {lesson: data});
  }

  static update(uid: string, data: GrammarActivity): Promise<GrammarActivity> {
    return requestPut(`${grammarActivityApiBaseUrl}/${uid}.json`, {lesson: data});
  }

  static remove(uid: string): Promise<string> {
    return requestDelete(`${grammarActivityApiBaseUrl}/${uid}.json`);
  }
}

export {
  GrammarActivityApi,
  grammarActivityApiBaseUrl,
  TYPE_GRAMMAR_ACTIVITY
}
