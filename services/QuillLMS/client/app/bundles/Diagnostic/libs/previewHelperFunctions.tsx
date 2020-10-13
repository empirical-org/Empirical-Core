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
  currentQuestion = answeredQuestions.filter((question: { data: Question }) => key === question.data.key)[0];
  // check unansweredQuestions
  if(!currentQuestion) {
    currentQuestion = unansweredQuestions.filter((question: { data: Question }) => key === question.data.key)[0];
  }
  // check questionSet, is title card
  if(!currentQuestion) {
    currentQuestion = questionSet.filter((question: { data: Question }) => key === question.data.key)[0];
  }
  return currentQuestion;
}

export const getQuestionsWithAttempts = (questions: { data: Question }[]) => {
  const questionsWithAttempts = {}

  questions.forEach(question => {
    const { data } = question;
    const { attempts, key } = data;
    if(attempts.length) {
      questionsWithAttempts[key] = question;
    }
  });

  return questionsWithAttempts;
}

export const getFilteredQuestions = ({ questionsSlice, answeredQuestionsWithAttempts, unansweredQuestionsWithAttempts }) => {
  if(!questionsSlice.length) {
    return [];
  }
  return questionsSlice.map((question: { data: Question }) => {
    const { data } = question;
    const { key } = data;
    const answeredQuestionWithAttempts = answeredQuestionsWithAttempts[key];
    const unansweredQuestionWithAttempts = unansweredQuestionsWithAttempts[key];

    if(answeredQuestionWithAttempts) {
      return answeredQuestionWithAttempts;
    } else if(unansweredQuestionWithAttempts) {
      return unansweredQuestionWithAttempts;
    } else {
      return question;
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
