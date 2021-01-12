import * as React from 'react';
import stripHtml from "string-strip-html";

import { getLatestAttempt } from './sharedQuestionFunctions';

import { Question } from '../interfaces/question';
import { Feedback } from '../../Shared/index';

export const getCurrentQuestion = ({ action, answeredQuestions, questionSet, unansweredQuestions }) => {
  const { data } = action;
  const { key } = data;
  let currentQuestion;

  // check answeredQuestions
  // Connect has type question: { question: {...}} and Diagnostic has type question: { data: {...}}
  currentQuestion = answeredQuestions.filter((questionObject: { data?: Question, question?: Question }) => {
    const { data, question } = questionObject;
    const dataObject = data || question;
    // some ELL SC questions get an -esp appended to the key
    return key === dataObject.key || key === `${dataObject.key}-esp`;
  })[0];

  // check unansweredQuestions
  if(!currentQuestion) {
    currentQuestion = unansweredQuestions.filter((questionObject: { data?: Question, question?: Question }) => {
      const { data, question } = questionObject;
      const dataObject = data || question;
      return key === dataObject.key || key === `${dataObject.key}-esp`;
    })[0];
  }
  // check questionSet, is title card
  if(!currentQuestion) {
    currentQuestion = questionSet.filter((questionObject: { data?: Question, question?: Question }) => {
      const { data, question } = questionObject;
      const dataObject = data || question;
      return key === dataObject.key
    })[0];
  }
  return currentQuestion;
}

// Connect has type question: { question: {...}} and Diagnostic has type question: { data: {...}}
export const getQuestionsWithAttempts = (questions: { data?: Question, question?: Question }[]) => {
  const questionsWithAttempts = {}

  questions.forEach(questionObject => {
    const { data, question } = questionObject;
    const dataObject = data || question;
    const { attempts, key } = dataObject;
    if(attempts && attempts.length) {
      questionsWithAttempts[key] = questionObject;
    }
  });

  return questionsWithAttempts;
}

export const getFilteredQuestions = ({ questionsSlice, answeredQuestionsWithAttempts, unansweredQuestionsWithAttempts }) => {
  if(!questionsSlice.length) {
    return [];
  }
  return questionsSlice.map((questionObject: { data?: Question, question?: Question }) => {
    const { data, question } = questionObject;
    const dataObject = data || question;
    const { key } = dataObject;
    // some ELL SC questions get an -esp appended to the key
    const slicedKey = key.slice(0, -4);
    const answeredQuestionWithAttempts = answeredQuestionsWithAttempts[key] || answeredQuestionsWithAttempts[slicedKey];
    const unansweredQuestionWithAttempts = unansweredQuestionsWithAttempts[key] || unansweredQuestionsWithAttempts[slicedKey];

    if(answeredQuestionWithAttempts) {
      return answeredQuestionWithAttempts;
    } else if(unansweredQuestionWithAttempts) {
      return unansweredQuestionWithAttempts;
    } else {
      return questionObject;
    }
  });
}

export const getDisplayedText = ({ previewMode, question, response }) => {
  const latestAttempt = getLatestAttempt(question.attempts);

  if(previewMode && latestAttempt && latestAttempt.response && latestAttempt.response.text) {
    return latestAttempt.response.text
  }
  return response;
}

export const renderPreviewFeedback = (latestAttempt) => {
  const { response } = latestAttempt;
  const { feedback, optimal } = response;
  const strippedFeedback = feedback ? stripHtml(feedback) : '';

  if(optimal && strippedFeedback) {
    return <Feedback feedback={strippedFeedback} feedbackType="correct-matched" />
  } else if(optimal && !strippedFeedback) {
    return <Feedback feedback="That's a great sentence!" feedbackType="correct-matched" />
  } else if(!optimal && strippedFeedback !== '') {
    return <Feedback feedback={strippedFeedback} feedbackType="revise-matched" />
  }
  // we don't want to show the directions if the question has already been answered in previewMode
  return null;
}
