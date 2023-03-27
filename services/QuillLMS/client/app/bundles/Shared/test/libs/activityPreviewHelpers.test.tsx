import * as expect from 'expect';
import * as React from 'react';

import { Feedback } from '../../../Shared/index';
import { getCurrentQuestion, getDisplayedText, getFilteredQuestions, getQuestionsWithAttempts, renderPreviewFeedback } from '../../libs/activityPreviewHelpers';

jest.mock("string-strip-html", () => ({
  default: jest.fn((value) => ((value)))
}));

describe('#getCurrentQuestion', () => {

  const action = { data: { key: 'abc'} };
  const answeredQuestions = [{key: 'abc'}, {key: 'def'}, {key: 'ghi'}];
  const unansweredQuestions = [{key: 'jkl'}, {key: 'mno'}];
  const questionSet = [{key: 'pqr'}, {key: 'stu'}];

  it('returns question object if action question key matches question object key or appened -esp in answeredQuestions array', () => {
    expect(getCurrentQuestion({ action, answeredQuestions, questionSet, unansweredQuestions })).toEqual(answeredQuestions[0]);
    action.data.key = 'abc-esp';
    expect(getCurrentQuestion({ action, answeredQuestions, questionSet, unansweredQuestions })).toEqual(answeredQuestions[0]);
  });
  it('returns question object if action question key matches question object key or appened -esp in unansweredQuestions array', () => {
    action.data.key = 'jkl';
    expect(getCurrentQuestion({ action, answeredQuestions, questionSet, unansweredQuestions })).toEqual(unansweredQuestions[0]);
    action.data.key = 'jkl-esp';
    expect(getCurrentQuestion({ action, answeredQuestions, questionSet, unansweredQuestions })).toEqual(unansweredQuestions[0]);
  });
  it('returns question object if action question key matches question object key in questionSet array', () => {
    action.data.key = 'pqr';
    expect(getCurrentQuestion({ action, answeredQuestions, questionSet, unansweredQuestions })).toEqual(questionSet[0]);
  });
});

describe('#getQuestionsWithAttempts', () => {

  const questions = [{key: 'abc'}, {key: 'def', attempts: [{}]}, {key: 'ghi'}, {key: 'jkl', attempts: [{}]}];
  const questionsWithAttempts = {
    def: questions[1],
    jkl: questions[3]
  };

  it('returns a hash of questions with attempts with key as key/uid and value as question object', () => {
    expect(getQuestionsWithAttempts(questions)).toEqual(questionsWithAttempts);
  });
});

describe('#getFilteredQuestions', () => {

  let questionsSlice = [{ key: 'abc'}];
  const answeredQuestionsWithAttempts = {
    abc: { key: 'def' }
  };
  const unansweredQuestionsWithAttempts = {
    jkl: { key: 'mno'}
  };
  const firstSlice = [answeredQuestionsWithAttempts['abc']]
  const secondSlice = [unansweredQuestionsWithAttempts['jkl']]

  it('returns an empty array if questionsSlice is empty', () => {
    expect(getFilteredQuestions({ questionsSlice: [], answeredQuestionsWithAttempts, unansweredQuestionsWithAttempts })).toEqual([]);
  });
  it('returns questionSlice mapped by keys matching answeredQuestionsWithAttempts', () => {
    expect(getFilteredQuestions({ questionsSlice, answeredQuestionsWithAttempts, unansweredQuestionsWithAttempts })).toEqual(firstSlice);
  });
  it('returns questionSlice mapped by keys matching unansweredQuestionsWithAttempts', () => {
    questionsSlice = [{ key: 'jkl'}];
    expect(getFilteredQuestions({ questionsSlice, answeredQuestionsWithAttempts, unansweredQuestionsWithAttempts })).toEqual(secondSlice);
  });
  it('returns questionSlice if keys unmatched in answeredQuestionsWithAttempts or unansweredQuestionsWithAttempts', () => {
    questionsSlice = [{ key: 'pqr'}];
    expect(getFilteredQuestions({ questionsSlice, answeredQuestionsWithAttempts, unansweredQuestionsWithAttempts })).toEqual(questionsSlice);
  });
});


describe('#getDisplayedText', () => {

  const question = {
    attempts: [{ response: { text: 'um suco de manga'} }]
  };
  const response = 'uma saideira favor';

  it('returns latestAttempt response text if previewMode is true and latestAttempt response text is present', () => {
    expect(getDisplayedText({ previewMode: true , question: question, response: response})).toEqual('um suco de manga');
  });
  it('returns response if previewMode is false or no latestAttempt', () => {
    expect(getDisplayedText({ previewMode: false , question: question, response: response})).toEqual('uma saideira favor');
    expect(getDisplayedText({ previewMode: false , question: {}, response: response})).toEqual('uma saideira favor');
  });
});

describe('#renderPreviewFeedback', () => {

  const latestAttempt = {
    response: {
      feedback: 'parabens!',
      optimal: true
    }
  }
  const firstFeedback = <Feedback feedback="parabens!" feedbackType="correct-matched" />;
  const secondFeedback = <Feedback feedback="That's a great sentence!" feedbackType="correct-matched" />;
  const thirdFeedback = <Feedback feedback="tenta de novo!" feedbackType="revise-matched" />;

  it('returns Feedback with type correct-matched if optimal is true and strippedFeedback present', () => {
    expect(renderPreviewFeedback(latestAttempt)).toEqual(firstFeedback);
  });
  it('returns Feedback with type correct-matched if optimal is true and default feedback if strippedFeedback not present', () => {
    latestAttempt.response.feedback = '';
    expect(renderPreviewFeedback(latestAttempt)).toEqual(secondFeedback);
  });
  it('returns Feedback with type revise-matched if optimal is false and strippedFeedback present', () => {
    latestAttempt.response.feedback = 'tenta de novo!';
    latestAttempt.response.optimal = false;
    expect(renderPreviewFeedback(latestAttempt)).toEqual(thirdFeedback);
  });
  it('returns null if optimal is false and strippedFeedback not present', () => {
    latestAttempt.response.feedback = '';
    expect(renderPreviewFeedback(latestAttempt)).toEqual(null);
  });
});
