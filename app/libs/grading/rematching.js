import request from 'request-promise';
import _ from 'underscore';

import { hashToCollection } from '../hashToCollection';
import POSMatcher from '../sentenceFragment.js';
import QuestionMatcher from '../question';
import DiagnosticQuestionMatcher from '../diagnosticQuestion.js';
import objectWithSnakeKeysFromCamel from '../objectWithSnakeKeysFromCamel';

export function rematchAll(mode, question, questionID) {
  const MarkerGenerator = getMatcher(mode);
  getGradedResponses(questionID).then((data) => {
    const markingObject = new MarkerGenerator(getMatcherFields(question, formatGradedResponses(data)));
    paginatedNonHumanResponses(markingObject, questionID, 1);
  });
}

export function rematchOne(response, mode, question, questionID, callback) {
  const MarkerGenerator = getMatcher(mode);
  getGradedResponses(questionID).then((data) => {
    const markingObject = new MarkerGenerator(getMatcherFields(question, formatGradedResponses(data)));
    const promise = rematchResponse(markingObject, response);
    if (promise) {
      promise.then(() => { callback(); });
    }
  });
}

export function paginatedNonHumanResponses(matcher, qid, page) {
  request(
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
    const rematchedResponses = rematchResponses(matcher, responseData.responses);
    if (page < data.numberOfPages) {
      return paginatedNonHumanResponses(matcher, qid, page + 1);
    }
  }).catch((err) => {
    console.log(err);
  });
}

function rematchResponses(matcher, responses) {
  _.each(hashToCollection(responses), (response) => {
    rematchResponse(matcher, response);
  });
}

function rematchResponse(matcher, response) {
  const newResponse = matcher.checkMatch(response.text);
  const delta = determineDelta(response, newResponse);
  // console.log(response.id, response.text, delta);
  switch (delta) {
    case 'tobeunmatched':
      return unmatchRematchedResponse(response);
    case 'tobedeleted':
      return deleteRematchedResponse(response);
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
    parentID: null,
    text: response.text,
    count: response.count,
    questionUID: response.questionUID,
  };
  return updateResponse(response.id, newVals);
}

function updateRematchedResponse(response, newResponse) {
  const newVals = {
    weak: false,
    parentID: newResponse.response.parentID,
    author: newResponse.response.author,
    feedback: newResponse.response.feedback,
    conceptResults: convertResponsesArrayToHash(newResponse.response.conceptResults),
  };
  return updateResponse(response.id, newVals);
}

function deleteRematchedResponse(response) {
  // deleteResponse(rid);
  console.log('Should be deleted');
}

function updateResponse(rid, content) {
  const rubyConvertedResponse = objectWithSnakeKeysFromCamel(content, false);
  return request({
    method: 'PUT',
    uri: `${process.env.QUILL_CMS}/responses/${rid}`,
    body: { response: rubyConvertedResponse, },
    json: true,
  });
}

function determineDelta(response, newResponse) {
  const unmatched = !newResponse.found && !!response.author;
  const parentIDChanged = (newResponse.response.parentID ? parseInt(newResponse.response.parentID) : null) !== response.parent_id;
  const authorChanged = newResponse.response.author != response.author;
  const feedbackChanged = newResponse.response.feedback != response.feedback;
  const conceptResultsChanged = _.isEqual(convertResponsesArrayToHash(newResponse.response.conceptResults), response.conceptResults);
  const changed = parentIDChanged || authorChanged || feedbackChanged || conceptResultsChanged;
  // console.log(response.id, parentIDChanged, authorChanged, feedbackChanged, conceptResultsChanged);
  // console.log(response, newResponse.response);
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

function getMatcher(mode) {
  if (mode === 'sentenceFragments') {
    return POSMatcher;
  } else if (mode === 'diagnosticQuestions') {
    return DiagnosticQuestionMatcher;
  }
  return QuestionMatcher;
}

function getMatcherFields(question, responses) {
  return {
    wordCountChange: question.wordCountChange,
    questionUID: question.key,
    sentences: question.sentences,
    prompt: question.prompt,
    responses: hashToCollection(responses),
    focusPoints: question.focusPoints ? hashToCollection(question.focusPoints) : [],
    incorrectSequences: question.incorrectSequences ? hashToCollection(question.incorrectSequences) : [],
    ignoreCaseAndPunc: question.ignoreCaseAndPunc,
  };
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

function formatGradedResponses(jsonString) {
  const bodyToObj = {};
  JSON.parse(jsonString).forEach((resp) => {
    bodyToObj[resp.id] = resp;
    if (typeof resp.concept_results === 'string') {
      resp.concept_results = JSON.parse(resp.concept_results);
    }
    for (const cr in resp.concept_results) {
      const formatted_cr = {};
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
    if (val.conceptUID.length > 0) {
      newHash[val.conceptUID] = val.correct;
    }
  });
  return newHash;
}
