import * as React from 'react';
import stripHtml from "string-strip-html";

import { Feedback, getLatestAttempt } from '../../Shared/index';
import { QuestionObject } from '../interfaces/question';

export const getCurrentQuestion = ({ action, answeredQuestions, questionSet, unansweredQuestions }) => {
  const { data, question } = action;
  const dataObject = data || question;
  const key = dataObject.key ? dataObject.key : dataObject.uid;
  let currentQuestion;

  // check answeredQuestions
  // Connect has type question: { question: {...}} and Diagnostic has type question: { data: {...}}
  currentQuestion = answeredQuestions.filter((questionObject: QuestionObject) => {
    const { data, question } = questionObject;
    const dataObject = data || question || questionObject;
    // some ELL SC questions get an -esp appended to the key
    return key === dataObject.key || key === `${dataObject.key}-esp` || key === dataObject.uid;
  })[0];

  // check unansweredQuestions
  if(!currentQuestion) {
    currentQuestion = unansweredQuestions.filter((questionObject: QuestionObject) => {
      const { data, question } = questionObject;
      const dataObject = data || question || questionObject;
      return key === dataObject.key || key === `${dataObject.key}-esp` || key === dataObject.uid;;
    })[0];
  }
  // check questionSet, is title card
  if(!currentQuestion) {
    currentQuestion = questionSet.filter((questionObject: QuestionObject) => {
      const { data, question } = questionObject;
      const dataObject = data || question || questionObject;
      return key === dataObject.key || key === dataObject.uid;
    })[0];
  }
  return currentQuestion;
}

// Connect has type question: { question: {...}} and Diagnostic has type question: { data: {...}}
export const getQuestionsWithAttempts = (questions: QuestionObject[]) => {
  const questionsWithAttempts = {}

  questions.forEach(questionObject => {
    const { data, question } = questionObject;
    const dataObject = data || question || questionObject;
    const { attempts, key, uid } = dataObject;
    const keyOrUid = key ? key : uid;
    if(attempts && attempts.length) {
      questionsWithAttempts[keyOrUid] = questionObject;
    }
  });

  return questionsWithAttempts;
}

export const getFilteredQuestions = ({ questionsSlice, answeredQuestionsWithAttempts, unansweredQuestionsWithAttempts }) => {
  if(!questionsSlice.length) {
    return [];
  }
  return questionsSlice.map((questionObject: QuestionObject) => {
    const { data, question } = questionObject;
    const dataObject = data || question || questionObject;
    const key = dataObject.key ? dataObject.key : dataObject.uid;
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
