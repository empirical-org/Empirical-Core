import * as _ from 'underscore';

// const qml = require('quill-marking-logic')
import { checkGrammarQuestion, ConceptResult } from 'quill-marking-logic'
import objectWithSnakeKeysFromCamel from '../objectWithSnakeKeysFromCamel';
import { hashToCollection } from '../../../Shared/index'
import { requestGet, requestPost, requestPut, } from '../../../../modules/request/index'

interface Question {
  conceptID: string,
  cues: string[],
  flag: string,
  focusPoints: FocusPoints,
  incorrectSequences: IncorrectSequence[],
  instructions: string,
  itemLevel: string,
  prompt: string,
  key?: string,
  wordCountChange?: object,
  ignoreCaseAndPunc?: Boolean
}

interface FocusPoints {
  [key: string]: FocusPoint
}

interface FocusPoint {
  feedback: string,
  text: string,
  order?: string
}

interface IncorrectSequence {
  conceptResults: ConceptResults,
  feedback: string,
  text: string
}

interface ConceptResults {
  [key: string]: ConceptResult
}

// interface ConceptResult {
//   conceptUID: string,
//   correct: Boolean,
//   name: string
// }

export function rematchAll(mode: string, questionID: string, callback:Function) {
  const rematchAllUrl = `${process.env.QUILL_CMS}/responses/rematch_all`;
  fetch(rematchAllUrl, {
    method: 'POST',
    body: JSON.stringify({ type: 'grammar_questions', uid: questionID}),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  }).then((response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  }).then((response) => {
    callback('done')
  }).catch((error) => {
    // to do - do something with this error
  });

}
export function rematchOne(response: string, mode: string, question: Question, questionID: string, callback: Function) {
  const matcher = getMatcher(mode);
  getGradedResponses(questionID).then((data: any) => {
    question.key = questionID
    const matcherFields = getMatcherFields(mode, question, formatGradedResponses(data));
    const promise = rematchResponse(matcher, matcherFields, response);
    if (promise) {
      promise.then(() => { callback(); });
    }
  });
}

export function paginatedNonHumanResponses(matcher, matcherFields, qid, page, callback) {
  requestPost(
    `${process.env.QUILL_CMS}/questions/${qid}/responses/search`,
    getResponseBody(page),
    (data) => {
      const parsedResponses = _.indexBy(data.results, 'id');
      const responseData = {
        responses: parsedResponses,
        numberOfResponses: data.numberOfResults,
        numberOfPages: data.numberOfPages,
      };
      const rematchedResponses = rematchResponses(matcher, matcherFields, responseData.responses);
      if (page < data.numberOfPages) {
        callback({ progress: Math.round(page / data.numberOfPages * 100), });
        return paginatedNonHumanResponses(matcher, matcherFields, qid, page + 1, callback);
      }
      callback({ progress: undefined, }, true);
    }
  )
}

function rematchResponses(matcher: any, matcherFields: any, responses: any) {
  _.each(hashToCollection(responses), (response) => {
    rematchResponse(matcher, matcherFields, response);
  });
}

function rematchResponse(matcher: any, matcherFields: any, response: any) {
  let newResponse, fieldsWithResponse;
  if (Array.isArray(matcherFields)) {
    fieldsWithResponse = [...matcherFields]
    fieldsWithResponse.splice(1, 0, response.text)
    newResponse = {response: matcher.apply(null, fieldsWithResponse) };
  } else {
    fieldsWithResponse = {...matcherFields, response: response.text}
    newResponse = {response: matcher(fieldsWithResponse)};
  }

  const delta = determineDelta(response, newResponse);
  switch (delta) {
    case 'tobeunmatched':
      return unmatchRematchedResponse(response);
    case 'tobeupdated':
      return updateRematchedResponse(response, newResponse);
    default:
      return false;
  }
}

function unmatchRematchedResponse(response: any) {
  const newVals = {
    weak: false,
    feedback: null,
    parent_id: null,
    text: response.text,
    count: response.count,
    question_uid: response.question_uid,
  };
  return updateResponse(response.id, newVals);
}

function updateRematchedResponse(response: any, newResponse: any) {
  const conceptResults = newResponse.response.conceptResults || newResponse.response.concept_results
  const newVals = {
    weak: false,
    parent_id: newResponse.response.parent_id,
    author: newResponse.response.author,
    feedback: newResponse.response.feedback,
    concept_results: convertResponsesArrayToHash(conceptResults),
  };
  return updateResponse(response.id, newVals);
}

function deleteRematchedResponse(response: any) {
  // deleteResponse(rid);
  // to do - do something with this method or delete it
}

function updateResponse(rid, content) {
  const rubyConvertedResponse = objectWithSnakeKeysFromCamel(content, false);
  requestPut(
    `${process.env.QUILL_CMS}/responses/${rid}`,
    { response: rubyConvertedResponse, }
  )
}

function determineDelta(response: any, newResponse: any) {
  const conceptResults = newResponse.response.conceptResults || newResponse.response.concept_results
  const unmatched = !newResponse.response.author && !!response.author;
  const parentIDChanged = (newResponse.response.parent_id ? Number(newResponse.response.parent_id) : null) !== response.parent_id;
  const authorChanged = newResponse.response.author !== response.author;
  const feedbackChanged = newResponse.response.feedback !== response.feedback;
  const conceptResultsChanged = !_.isEqual(convertResponsesArrayToHash(conceptResults), response.concept_results);
  const changed = parentIDChanged || authorChanged || feedbackChanged || conceptResultsChanged;
  if (changed) {
    if (unmatched) {
      return 'tobeunmatched';
    }
    return 'tobeupdated';
  }
  return 'unchanged';
}

function saveResponses(responses: any) {
  return responses;
}

function getMatcher(mode: string): Function {
  return checkGrammarQuestion;
}

function getMatcherFields(mode: string, question: Question, responses: {[key: string]: Response}) {
  const responseArray = hashToCollection(responses);
  const focusPoints = question.focusPoints ? hashToCollection(question.focusPoints).sort((a, b) => a.order - b.order) : [];
  const incorrectSequences = question.incorrectSequences ? hashToCollection(question.incorrectSequences) : [];
  const defaultConceptUID = question.modelConceptUID || question.concept_uid
  return [question.key, responseArray, focusPoints, incorrectSequences, defaultConceptUID]
}

function getResponseBody(pageNumber: number) {
  return {
    search: {
      filters: {
        author: [],
        status: [0, 1],
      },
      pageNumber,
      sort: {
        column: 'count',
        direction: 'desc',
      },
      text: '',
    },
  };
}

function getGradedResponses(questionID) {
  return requestGet(`${process.env.QUILL_CMS}/questions/${questionID}/responses`);
}

function formatGradedResponses(jsonString: string): {[key: string]: Response} {
  const bodyToObj = {};
  JSON.parse(jsonString).forEach((resp: any) => {
    bodyToObj[resp.id] = resp;
    if (typeof resp.concept_results === 'string') {
      resp.concept_results = JSON.parse(resp.concept_results);
    }
    for (const cr in resp.concept_results) {
      if (resp.concept_results.hasOwnProperty(cr)) {
        const formattedCr: any = {};
        formattedCr.conceptUID = cr;
        formattedCr.correct = resp.concept_results[cr];
        resp.concept_results[cr] = formattedCr;
      }
    }
    resp.conceptResults = resp.concept_results;
    delete resp.concept_results;
  });
  return bodyToObj;
}

function convertResponsesArrayToHash(crArray: any) {
  const crs = _.values(crArray);
  const newHash: {[key:string]: Boolean} = {};
  _.each(crs, (val) => {
    if (val.conceptUID && val.conceptUID.length > 0) {
      newHash[val.conceptUID] = val.correct;
    }
  });
  return newHash;
}
