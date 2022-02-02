const request = require('request-promise').defaults({ family: 4 });
const _ = require('lodash');
const u = require('underscore');
const Sequelize = require('sequelize');

const { checkSentenceCombining, checkSentenceFragment, checkDiagnosticQuestion, checkFillInTheBlankQuestion, checkDiagnosticSentenceFragment, checkGrammarQuestion, ConceptResult } = require('quill-marking-logic')
const CMS_URL = 'https://cms.quill.org'
const FIREBASE_NAME = 'quillconnect'

const sequelize = new Sequelize(process.env.DATABASE, process.env.USERNAME, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: 'postgres',
  port: 5432,
  logging: false,

  pool: {
    max: 30,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false
});

const QuestionResponse = sequelize.define('response', {
  uid: Sequelize.STRING,
  parent_id: Sequelize.INTEGER,
  parent_uid: Sequelize.STRING,
  question_uid: Sequelize.STRING,
  author: Sequelize.STRING,
  text: Sequelize.TEXT,
  feedback: Sequelize.TEXT,
  count: Sequelize.INTEGER,
  first_attempt_count: Sequelize.INTEGER,
  child_count: Sequelize.INTEGER,
  optimal: Sequelize.BOOLEAN,
  weak: Sequelize.BOOLEAN,
  concept_results: Sequelize.JSONB,
  spelling_error: Sequelize.BOOLEAN
},
{
  timestamps: true,
  underscored: true,
});

let questionCount = 0
const numberOfResponses = {}

function objectWithSnakeKeysFromCamel(camelObj, convertCR = true) {
  const snakeObj = {};

  for (const camelKey in camelObj) {
    if (camelObj.hasOwnProperty(camelKey)) {
      let snakeKey;
      switch (camelKey) {
        case 'questionUID':
          snakeKey = 'question_uid';
          break;
        case 'gradeIndex':
          snakeKey = 'grade_index';
          break;
        case 'parentID':
          snakeKey = 'parent_id';
          break;
        case 'conceptResults':
          snakeKey = 'concept_results';
          break;
        default:
          snakeKey = camelKey;
      }
      snakeObj[snakeKey] = camelObj[camelKey];
    }
  }
  return snakeObj;
}

function embedKeys(hash) {
  return _.mapValues(hash, (val, key) => {
    if (val) {
      val.key = key;
      return val;
    }
  });
}

function hashToCollection(hash) {
  const wEmbeddedKeys = embedKeys(hash);
  const array = _.values(wEmbeddedKeys);
  return _.compact(array)
}

function rematchIndividualQuestion(response, type, question, referenceResponses) {
  const matcher = getMatcher(type);
  const data = referenceResponses;
  const formattedReferenceResponses = formatGradedResponses(data)
  if (_.values(formattedReferenceResponses).find(resp => resp.optimal)) {
    const matcherFields = getMatcherFields(type, question, formattedReferenceResponses);
    return rematchResponse(matcher, matcherFields, response)
  }
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

  return Promise.resolve(newResponse.response).then(newResolvedResponse => {
    const newResponse = { response: newResolvedResponse }
    const delta = determineDelta(response, newResponse);
    switch (delta) {
      case 'tobeunmatched':
        return unmatchRematchedResponse(response);
      case 'tobeupdated':
        return updateRematchedResponse(response, newResponse);
      default:
        return {};
    }
  });
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
  return updateResponse(response, newVals);
}

function updateRematchedResponse(response, newResponse) {
  const conceptResults = newResponse.response.conceptResults || newResponse.response.concept_results
  const newVals = {
    weak: false,
    parent_id: newResponse.response.parent_id,
    author: newResponse.response.author,
    feedback: newResponse.response.feedback,
    concept_results: convertResponsesArrayToHash(conceptResults),
  };
  return updateResponse(response, newVals);
}

function updateResponse(response, content) {
  const rubyConvertedResponse = objectWithSnakeKeysFromCamel(content);
  Object.assign(response, rubyConvertedResponse)
  return response
}

function determineDelta(response, newResponse) {
  const conceptResults = newResponse.response.conceptResults || newResponse.response.concept_results
  const parentIDChanged = (newResponse.response.parent_id? parseInt(newResponse.response.parent_id) : null) !== response.parent_id;
  const authorChanged = newResponse.response.author != response.author;
  const feedbackChanged = newResponse.response.feedback != response.feedback;
  const conceptResultsChanged = !_.isEqual(convertResponsesArrayToHash(conceptResults), response.concept_results);
  const changed = parentIDChanged || authorChanged || feedbackChanged || conceptResultsChanged;

  if (changed) {
    return 'tobeupdated';
  }
  return 'unchanged';
}

function getMatcher(type) {
  if (type === 'sentenceFragments') {
    return checkSentenceFragment;
  } else if (type === 'diagnostic_sentenceFragments') {
    return checkDiagnosticSentenceFragment;
  } else if (type === 'diagnostic_questions') {
    return checkDiagnosticQuestion;
  } else if (type === 'fillInBlankQuestions' || type === 'diagnostic_fillInBlankQuestions') {
    return checkFillInTheBlankQuestion;
  } else if (type === 'grammar_questions') {
    return checkGrammarQuestion;
  }
  return checkSentenceCombining;
}

function getMatcherFields(type, question, responses) {
  const responseArray = hashToCollection(responses);
  const focusPoints = question.focusPoints ? hashToCollection(question.focusPoints).sort((a, b) => a.order - b.order) : [];
  const incorrectSequences = question.incorrectSequences ? hashToCollection(question.incorrectSequences) : [];
  const defaultConceptUID = question.modelConceptUID || question.conceptID || question.concept_uid

  if (type === 'sentenceFragments' || type === 'diagnostic_sentenceFragments') {
    return {
      wordCountChange: question.wordCountChange,
      question_uid: question.key,
      prompt: question.prompt,
      responses: responseArray,
      focusPoints: focusPoints,
      incorrectSequences: incorrectSequences,
      ignoreCaseAndPunc: question.ignoreCaseAndPunc,
      checkML: true,
      mlUrl: CMS_URL,
      defaultConceptUID
    };
  } else if (type === 'fillInBlankQuestions' || type === 'diagnostic_fillInBlankQuestions') {
    return [question.key, hashToCollection(responses), defaultConceptUID]
  } else {
    return [question.key, responseArray, focusPoints, incorrectSequences, defaultConceptUID]
  }
}

function formatGradedResponses(referenceResponses) {
  const bodyToObj = {};
  referenceResponses.forEach((resp) => {
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
    if (val.conceptUID && val.conceptUID.length > 0) {
      newHash[val.conceptUID] = val.correct;
    }
  });
  return newHash;
}

module.exports = {
  rematchIndividualQuestion
}
