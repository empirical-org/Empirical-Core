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

function rematchIndividualQuestionHelper(questionID, type, question, index) {
  if (index == questionCount) {
    console.log('questionID', questionID)
    const matcher = getMatcher(type);
    console.log('matcher', matcher)
    return getGradedResponses(questionID).then((data) => {
      const formattedData = formatGradedResponses(data)
      if (_.values(formattedData).find(resp => resp.optimal)) {
        question.key = questionID
        const matcherFields = getMatcherFields(type, question, formattedData);
        paginatedNonHumanResponses(matcher, matcherFields, questionID, 1);
      } else {
        questionCount ++
        console.log('questionCount', questionCount)
      }
    });
  } else {
    const timeoutLength = (index - questionCount) * 10
    setTimeout(rematchIndividualQuestionHelper, timeoutLength, questionID, type, question, index)
  }
}

function rematchOne(response, type, question, questionID) {
  const matcher = getMatcher(type);
  getGradedResponses(questionID).then((data) => {
    question.key = questionID
    const matcherFields = getMatcherFields(type, question, formatGradedResponses(data));
    const promise = rematchResponse(matcher, matcherFields, response);
  });
}

function whereStatementForNonHumanGradedResponsesByQuestionId(qid) {
  return {
    question_uid: qid,
    [Sequelize.Op.or]: [
      {
        // unmatched response
        [Sequelize.Op.and]: [
          {
            parent_id: null,
            optimal: null,
            parent_uid: null
          }
        ]
      },
      {
        // algorithmic optimal or suboptimal
        [Sequelize.Op.or]: [
          {
            parent_id: {
              [Sequelize.Op.not]: null
            },
          },
          {
            parent_uid: {
              [Sequelize.Op.not]: null
            },
          }
        ]
      },
    ]
  }
}

function paginatedNonHumanResponses(matcher, matcherFields, qid, page) {
  const numberOfResponsesForQuestion = numberOfResponses[qid]
  if (!numberOfResponsesForQuestion) {
    QuestionResponse.count(
      { where: whereStatementForNonHumanGradedResponsesByQuestionId(qid)}
    ).then(count => {
      numberOfResponses[qid] = count
      paginatedNonHumanResponsesHelper(count, matcher, matcherFields, qid, page)
    })
  } else {
    paginatedNonHumanResponsesHelper(numberOfResponsesForQuestion, matcher, matcherFields, qid, page)
  }
}

function paginatedNonHumanResponsesHelper(numberOfResponses, matcher, matcherFields, qid, page) {
  if (page < 51) {
    QuestionResponse.findAll({
      where: whereStatementForNonHumanGradedResponsesByQuestionId(qid),
      offset: (page - 1) * 200,
      limit: 200,
      order: [
        ['count', 'DESC']
      ],
    },
  )
    .then((data) => {
      const parsedResponses = u.indexBy(data, 'id');
      const responseData = {
        responses: parsedResponses,
        numberOfResponses: numberOfResponses,
        numberOfPages: numberOfResponses / 200,
      };
      const rematchedResponses = rematchResponses(matcher, matcherFields, responseData.responses);
      if (page < responseData.numberOfPages) {
        console.log('page', page)
        return paginatedNonHumanResponses(matcher, matcherFields, qid, page + 1);
      } else {
        incrementQuestionCountAndReindexResponses(qid)
      }
    }).catch((err) => {
      console.log(err);
    }).catch((err) => {
      console.log(err)
      console.log('moving to next question')
      incrementQuestionCountAndReindexResponses(qid)
    });
  } else {
    console.log('too many responses, stopped on page 50')
    incrementQuestionCountAndReindexResponses(qid)
  }
}

function incrementQuestionCountAndReindexResponses(qid) {
  questionCount++
  console.log('completed questions: ', questionCount)
  request({
    uri: `${CMS_URL}/question/${qid}/reindex_responses_updated_today_for_given_question`,
    method: 'PUT',
    json: true,
  })
  .then(() => console.log('reindex responses'))
  .catch(err => console.log(err))
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

  Promise.resolve(newResponse.response).then(newResolvedResponse => {
    const newResponse = { response: newResolvedResponse }
    const delta = determineDelta(response, newResponse);
    switch (delta) {
      case 'tobeunmatched':
        return unmatchRematchedResponse(response);
      case 'tobeupdated':
        return updateRematchedResponse(response, newResponse);
      default:
        return false;
    }
  })
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

function updateResponse(rid, content) {
  // const beginning = Date.now()
  const rubyConvertedResponse = objectWithSnakeKeysFromCamel(content);
  QuestionResponse.findByPk(rid).then(response => {
    if (response) {
      response.update(rubyConvertedResponse)
      // .then(() => console.log('elapsed', Date.now() - beginning))
      .catch(err => console.log(err))
    }
  })
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

function saveResponses(responses) {
  return responses;
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
  const focusPoints = question.focusPoints ? hashToCollection(question.focusPoints) : [];
  const incorrectSequences = question.incorrectSequences ? hashToCollection(question.incorrectSequences) : [];
  const defaultConceptUID = question.modelConceptUID || question.conceptID

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
  } else if (type === 'fillInBlankQuestions' || type === 'diagnostic_fillInBlankQuestions' || type === 'grammar_questions') {
    return [question.key, hashToCollection(responses), defaultConceptUID]
  } else {
    return [question.key, responseArray, focusPoints, incorrectSequences, defaultConceptUID]
  }
}

function getGradedResponses(questionID) {
  return request(`${CMS_URL}/questions/${questionID}/responses`);
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
    if (val.conceptUID && val.conceptUID.length > 0) {
      newHash[val.conceptUID] = val.correct;
    }
  });
  return newHash;
}

function rematchAllQuestionsOfAType(type) {
  let uri
  if (type === 'grammar_questions') {
    uri = `https://${FIREBASE_NAME}.firebaseio.com/v3/questions.json`
  } else {
    uri = `https://${FIREBASE_NAME}.firebaseio.com/v2/${type}.json`
  }
  return request(
    {
      uri,
      method: 'GET'
    },
  ).then((data) => {
    const questions = JSON.parse(data)
    const filteredQuestions = _.pickBy(questions, (q) => q.flag !== 'archived' && q.prompt)
    Object.keys(filteredQuestions).forEach((key, index) => {
      setTimeout(rematchIndividualQuestionHelper, 1, key, type, filteredQuestions[key], index);
    })
  }).catch((err) => {
    console.log(err);
  });
}

function rematchIndividualQuestion(question_uid, type) {
  let uri
  if (type === 'grammar_questions') {
    uri = `https://${FIREBASE_NAME}.firebaseio.com/v3/questions/${question_uid}.json`
  } else {
    uri = `https://${FIREBASE_NAME}.firebaseio.com/v2/${type}/${question_uid}.json`
  }
  return request(
    {
      uri,
      method: 'GET'
    },
  ).then((data) => {
    rematchIndividualQuestionHelper(question_uid, type, JSON.parse(data), 0)
  }).catch((err) => {
    console.log(err);
  });
}

module.exports = {
  rematchAllQuestionsOfAType,
  rematchIndividualQuestion
}
