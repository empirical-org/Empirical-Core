declare function require(name:string);
const request = require('request-promise');
import * as _ from 'underscore';
import { hashToCollection } from 'quill-component-library/dist/componentLibrary';

// const qml = require('quill-marking-logic')
import { checkSentenceCombining, checkSentenceFragment, checkDiagnosticQuestion, checkFillInTheBlankQuestion, ConceptResult } from 'quill-marking-logic'
import objectWithSnakeKeysFromCamel from '../objectWithSnakeKeysFromCamel';

interface Question {
  conceptID: string,
  cues: Array<string>,
  flag: string,
  focusPoints: FocusPoints,
  incorrectSequences: Array<IncorrectSequence>,
  instructions: string,
  itemLevel: string,
  prefilledText: string,
  prompt: string,
  key?: string,
  wordCountChange?:object,
  ignoreCaseAndPunc?:Boolean
}

interface FocusPoints {
  [key:string]: FocusPoint
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
  [key:string]: ConceptResult
}

// interface ConceptResult {
//   conceptUID: string,
//   correct: Boolean,
//   name: string
// }

export function rematchAll(mode: string, question: Question, questionID: string, callback:Function) {
  const matcher = getMatcher(mode);
  getGradedResponses(questionID).then((data) => {
    question.key = questionID
    const matcherFields = getMatcherFields(mode, question, formatGradedResponses(data));
    paginatedNonHumanResponses(matcher, matcherFields, questionID, 1, callback);
  });
}

export function rematchOne(response: string, mode: string, question: Question, questionID: string, callback:Function) {
  const matcher = getMatcher(mode);
  getGradedResponses(questionID).then((data) => {
    question.key = questionID
    const matcherFields = getMatcherFields(mode, question, formatGradedResponses(data));
    const promise = rematchResponse(matcher, matcherFields, response);
    if (promise) {
      promise.then(() => { callback(); });
    }
  });
}

export function paginatedNonHumanResponses(matcher, matcherFields, qid, page, callback) {

  return request(
    {
      uri: `${process.env.QUILL_CMS}/questions/${qid}/responses/search`,
      method: 'POST',
      body: getResponseBody(page),
      json: true,
    },
  ).then((data) => {
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
  }).catch((err) => {
    // to do - do something with this error
  });
}

function rematchResponses(matcher, matcherFields, responses) {
  _.each(hashToCollection(responses), (response) => {
    rematchResponse(matcher, matcherFields, response);
  });
}

function rematchResponse(matcher, matcherFields, response) {
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

function unmatchRematchedResponse(response) {
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

function updateRematchedResponse(response, newResponse) {
  const newVals = {
    weak: false,
    parent_id: newResponse.response.parent_id,
    author: newResponse.response.author,
    feedback: newResponse.response.feedback,
    concept_results: convertResponsesArrayToHash(newResponse.response.concept_results),
  };
  return updateResponse(response.id, newVals);
}

function deleteRematchedResponse(response) {
  // deleteResponse(rid);
  // to do - do something with this method or delete it
}

function updateResponse(rid, content) {
  const rubyConvertedResponse = objectWithSnakeKeysFromCamel(content);
  return request({
    method: 'PUT',
    uri: `${process.env.QUILL_CMS}/responses/${rid}`,
    body: { response: rubyConvertedResponse, },
    json: true,
  });
}

function determineDelta(response, newResponse) {
  const unmatched = !newResponse.response.author && !!response.author;
  const parentIDChanged = (newResponse.response.parent_id? parseInt(newResponse.response.parent_id) : null) !== response.parent_id;
  const authorChanged = newResponse.response.author != response.author;
  const feedbackChanged = newResponse.response.feedback != response.feedback;
  const conceptResultsChanged = _.isEqual(convertResponsesArrayToHash(newResponse.response.concept_results), response.concept_results);
  const changed = parentIDChanged || authorChanged || feedbackChanged || conceptResultsChanged;
  if (changed) {
    if (unmatched) {
      return 'tobeunmatched';
    }
    return 'tobeupdated';
  }
  return 'unchanged';
}

function saveResponses(responses) {
  return responses;
}

function getMatcher(mode:string):Function {
  if (mode === 'sentenceFragments') {
    return checkSentenceFragment;
  } else if (mode === 'diagnosticQuestions') {
    return checkDiagnosticQuestion;
  } else if (mode === 'fillInBlank') {
    return checkFillInTheBlankQuestion;
  }
  return checkSentenceCombining;
}

function getMatcherFields(mode:string, question:Question, responses:{[key:string]: Response}) {

  const responseArray = hashToCollection(responses);
  const focusPoints = question.focusPoints ? hashToCollection(question.focusPoints).sort((a, b) => a.order - b.order) : [];
  const incorrectSequences = question.incorrectSequences ? hashToCollection(question.incorrectSequences) : [];

  if (mode === 'sentenceFragments') {
    return {
      wordCountChange: question.wordCountChange,
      question_uid: question.key,
      prompt: question.prompt,
      responses: responseArray,
      focusPoints: focusPoints,
      incorrectSequences: incorrectSequences,
      ignoreCaseAndPunc: question.ignoreCaseAndPunc,
      checkML: true,
      mlUrl: process.env.CMS_URL
    };
  } else if (mode === 'diagnosticQuestions') {
    return [question.key, hashToCollection(responses)]
  } else if (mode === 'fillInBlank') {
    return [question.key, hashToCollection(responses)]
  } else {
    return [question.key, responseArray, focusPoints, incorrectSequences]
  }
}


function getResponseBody(pageNumber) {
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
  return request(`${process.env.QUILL_CMS}/questions/${questionID}/responses`);
}

function formatGradedResponses(jsonString):{[key:string]: Response} {
  const bodyToObj = {};
  JSON.parse(jsonString).forEach((resp) => {
    bodyToObj[resp.id] = resp;
    if (typeof resp.concept_results === 'string') {
      resp.concept_results = JSON.parse(resp.concept_results);
    }
    for (const cr in resp.concept_results) {
      const formatted_cr:any = {};
      formatted_cr.conceptUID = cr;
      formatted_cr.correct = resp.concept_results[cr];
      resp.concept_results[cr] = formatted_cr;
    }
    resp.conceptResults = resp.concept_results;
    delete resp.concept_results;
  });
  return bodyToObj;
}

function convertResponsesArrayToHash(crArray) {
  const crs = _.values(crArray);
  const newHash = {};
  _.each(crs, (val) => {
    if (val.conceptUID && val.conceptUID.length > 0) {
      newHash[val.conceptUID] = val.correct;
    }
  });
  return newHash;
}
