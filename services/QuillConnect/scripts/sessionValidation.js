const _ = require('underscore');
const request = require('request');
const sessions = require('../app/actions/sessions.js');
const SessionActions = sessions.default
const denormalizeSession = sessions.denormalizeSession;
const normalizeSession = sessions.normalizeSession;
const allQuestions = sessions.allQuestions
const testData1 = require('./sessionValidation.data.js');
const testData2 = require('./sessionValidation.data2.js');
const testData3 = require('./sessionValidation.data3.js');

const baseFirebasePath = 'https://quillconnect.firebaseio.com/v2';
const sessionPath = `${baseFirebasePath}/savedSessions`;
const connectQuestionPath = `${baseFirebasePath}/questions`;
const fillInBlankQuestionPath = `${baseFirebasePath}/fillInBlankQuestions`;

async function initializeQuestionData() {
  const connectUrl = `${connectQuestionPath}.json`;
  let connectQuestions = await syncRequest(connectUrl);
  SessionActions.populateQuestions("SC", JSON.parse(connectQuestions));

  const fillInBlankUrl = `${fillInBlankQuestionPath}.json`;
  let fillInBlankQuestions = await syncRequest(fillInBlankUrl);
  SessionActions.populateQuestions("FB", JSON.parse(fillInBlankQuestions));
}

async function syncRequest(url) {
  return new Promise((resolve, reject) => {
    request(url, (err, resp, body) => {
      if (err) reject(err);
      else resolve(body);
    });
  });
}

async function processSessions(sessionIds) {
  const matchUids = [];
  const mismatchUids = [];
  const nullUids = [];
  const questionTotal = {};
  const questionMatches = {};

  for (let i = 0; i < sessionIds.sessionsToTest.length; i++) {
    let uid = sessionIds.sessionsToTest[i];
    let url = `${sessionPath}/${uid}.json`;
    let body = await syncRequest(url);
    const originalResponse = JSON.parse(body);
    if (originalResponse) {
      removeExtraKeysFromSession(originalResponse);
      let processedResponse = denormalizeSession(normalizeSession(JSON.parse(body)));
      removeExtraKeysFromSession(processedResponse);
      if (_.isEqual(originalResponse, processedResponse)) {
        matchUids.push(uid);
      } else {
        mismatchUids.push(uid);
      }
      Object.keys(processedResponse).forEach((key) => {
        if (!questionTotal[key]) questionTotal[key] = 0;
        if (!questionMatches[key]) questionMatches[key] = 0;
        if (key === 'currentQuestion') {
          questionTotal[key]++;
          //if (_.isEqual(originalResponse[key], processedResponse[key])) {
          if (_.isEqual(originalResponse[key], processedResponse[key])) {
            questionMatches[key]++;
          }
        } else {
          for (let i = 0; i < processedResponse[key].length; i++) {
            questionTotal[key]++;
            questionMatches[key] += _.isEqual(originalResponse[key][i], processedResponse[key][i]) ? 1 : 0;
          }
        }
      })
    } else {
      nullUids.push(uid);
    }
  }

  console.log(`Exact matches: ${matchUids.length}`);
  console.log(`Mismatches: ${mismatchUids.length}`);
  console.log(`Missing sessions: ${nullUids.length}`);
  Object.keys(questionMatches).forEach((key) => {
    console.log(`${questionMatches[key]} out of ${questionTotal[key]} ${key} questions matched (${questionMatches[key]/questionTotal[key] * 100}%)`);
  });
}

function compareDataKey(key, oldSess, newSess) {
  console.log(`${key} matches: ${_.isEqual(oldSess[key], newSess[key])}`);
}

function stripExtraKeys(session) {
  // Examining the data it was discovered that some v2 session sub-objects
  // contain "key" keys that store the value of their, well, keys.
  // After discussion with Emilia and digging into the code, it looks like
  // these are assigned as part of some object-to-array function that we run
  // the data through which the normalization drops off.  Further examination
  // reveals that the code doesn't actually need to persist these keys as it
  // doesn't actually use them, it looks like they're just a side-effect.
  // So for the purposes of testing session matching, we're going to strip
  // off the known unnecessary "key" keys.
  if (!session.answeredQuestions) return;
  session.answeredQuestions.forEach((question) => {
    question.question.incorrectSequences.forEach((incSeq) => {
      delete incSeq["key"];
    });
    Object.keys(question.question.focusPoints).forEach((key) => {
      delete question.question.focusPoints[key]["key"];
    });
  });
}

function removeExtraKeysFromSession(session) {
  stripCollectionIfExists(session.answeredQuestions);
  stripCollectionIfExists(session.unansweredQuestions);
  stripCollectionIfExists(session.questionSet);
  stripIncorrectSequencesAndFocusPoints(session.currentQuestion);
}

function stripCollectionIfExists(collection) {
  if (!collection) return;
  collection.forEach((item) => stripIncorrectSequencesAndFocusPoints(item));
}

function stripIncorrectSequencesAndFocusPoints(question) {
  if (!question) return;
  const cleanKeysIn = ['focusPoints', 'incorrectSequences']
  for (let i = 0; i < cleanKeysIn.length; i++) {
    let type = cleanKeysIn[i];
    if (!question.question[type]) continue;
    stripExtraneousKeyKeys(question.question[type]);
    if (Array.isArray(question.question[type])) {
      for (let j = 0; j < question.question[type].length; j++) {
        if (!question.question[type][j]) continue;
        stripExtraneousKeyKeys(question.question[type][j].conceptResults);
      }
    } else {
      Object.keys(question.question[type]).forEach((conceptResultId) => {
        stripExtraneousKeyKeys(question.question[type][conceptResultId].conceptResults);
      });
    }
  }
}

function stripExtraneousKeyKeys(target) {
  if (!target) return;
  if(Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      if (!target[i]) continue;
      delete target[i]['key'];
    }
  } else {
    Object.keys(target).forEach((key) => {
      delete target[key]['key'];
    });
  }
}

async function testSessions() {
  await initializeQuestionData();
  await processSessions(testData1);
  await processSessions(testData2);
  await processSessions(testData3);
}

testSessions();
