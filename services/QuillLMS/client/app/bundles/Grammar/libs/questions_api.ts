import { requestDelete, requestGet, requestPost, requestPut } from '../../../modules/request/index';
import { FocusPoint, IncorrectSequence, Question } from '../interfaces/questions';

const GRAMMAR_QUESTION_TYPE = 'grammar'

const questionApiBaseUrl = `${process.env.DEFAULT_URL}/api/v1/questions`;

class QuestionApi {
  static getAll(questionType: string): Promise<Array<Question>> {
    return requestGet(`${questionApiBaseUrl}.json?question_type=${questionType}`, null, (error) => {throw(error)});
  }

  static get(uid: string): Promise<Question> {
    return requestGet(`${questionApiBaseUrl}/${uid}.json`, null, (error) => {throw(error)});
  }

  static create(questionType: string, data: Question): Promise<Array<Question>> {
    return requestPost(`${questionApiBaseUrl}.json?question_type=${questionType}`, {question: data}, null, (error) => {throw(error)});
  }

  static update(uid: string, data: Question): Promise<Question> {
    return requestPut(`${questionApiBaseUrl}/${uid}.json`, {question: data}, null, (error) => {throw(error)});
  }

  static updateFlag(uid: string, flag: string): Promise<Question> {
    return requestPut(`${questionApiBaseUrl}/${uid}/update_flag.json`, {
      question: {
        flag: flag
      }
    }, null, (error) => {throw(error)});
  }

  static updateModelConcept(uid: string, modelConceptUid: string): Promise<Question> {
    return requestPut(`${questionApiBaseUrl}/${uid}/update_model_concept.json`, {
      question: {
        modelConcept: modelConceptUid
      }
    }, null, (error) => {throw(error)});
  }
}

class FocusPointApi {
  static getAll(questionId: string): Promise<FocusPointCollection> {
    return requestGet(`${questionApiBaseUrl}/${questionId}/focus_points.json`, null, (error) => {throw(error)});
  }

  static get(questionId: string, focusPointId: string): Promise<FocusPoint> {
    return requestGet(`${questionApiBaseUrl}/${questionId}/focus_points/${focusPointId}.json`, null, (error) => {throw(error)});
  }

  static create(questionId: string, data: FocusPoint): Promise<FocusPointCollection> {
    return requestPost(`${questionApiBaseUrl}/${questionId}/focus_points.json`, {focus_point: data}, null, (error) => {throw(error)});
  }

  static update(questionId: string, focusPointId: string, data: FocusPoint): Promise<FocusPoint> {
    return requestPut(`${questionApiBaseUrl}/${questionId}/focus_points/${focusPointId}.json`, {focus_point: data}, null, (error) => {throw(error)});
  }

  static updateAllForQuestion(questionId: string, data: FocusPointCollection): Promise<FocusPointCollection> {
    return requestPut(`${questionApiBaseUrl}/${questionId}/focus_points/update_all.json`, {focus_point: data}, null, (error) => {throw(error)});
  }

  static remove(questionId: string, focusPointId: string): Promise<string> {
    return requestDelete(`${questionApiBaseUrl}/${questionId}/focus_points/${focusPointId}.json`, null, null, (error) => {throw(error)});
  }
}

class IncorrectSequenceApi {
  static getAll(questionId: string): Promise<IncorrectSequenceCollection> {
    return requestGet(`${questionApiBaseUrl}/${questionId}/incorrect_sequences.json`, null, (error) => {throw(error)});
  }

  static get(questionId: string, incorrectSequenceId: string): Promise<IncorrectSequence> {
    return requestGet(`${questionApiBaseUrl}/${questionId}/incorrect_sequences/${incorrectSequenceId}.json`, null, (error) => {throw(error)});
  }

  static create(questionId: string, data: IncorrectSequence): Promise<IncorrectSequenceCollection> {
    return requestPost(`${questionApiBaseUrl}/${questionId}/incorrect_sequences.json`, {incorrect_sequence: data}, null, (error) => {throw(error)});
  }

  static update(questionId: string, incorrectSequenceId: string, data: IncorrectSequence): Promise<IncorrectSequence> {
    return requestPut(`${questionApiBaseUrl}/${questionId}/incorrect_sequences/${incorrectSequenceId}.json`, {incorrect_sequence: data}, null, (error) => {throw(error)});
  }

  static updateAllForQuestion(questionId: string, data: IncorrectSequenceCollection): Promise<IncorrectSequenceCollection> {
    return requestPut(`${questionApiBaseUrl}/${questionId}/incorrect_sequences/update_all.json`, {incorrect_sequence: data}, null, (error) => {throw(error)});
  }

  static remove(questionId: string, incorrectSequenceId: string): Promise<string> {
    return requestDelete(`${questionApiBaseUrl}/${questionId}/incorrect_sequences/${incorrectSequenceId}.json`, null, null, (error) => {throw(error)});
  }
}

export {
  QuestionApi,
  FocusPointApi,
  IncorrectSequenceApi,
  GRAMMAR_QUESTION_TYPE,
  questionApiBaseUrl
};

