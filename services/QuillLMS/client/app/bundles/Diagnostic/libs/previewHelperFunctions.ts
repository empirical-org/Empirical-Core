import { Question } from '../interfaces/question';

export const getCurrentQuestion = ({ action, answeredQuestions, unansweredQuestions, questionSet }) => {
  let currentQuestion;
  // check answeredQuestions
  currentQuestion = answeredQuestions.filter((question: { data: Question }) => action.data.key === question.data.key)[0];
  // check unansweredQuestions
  if(!currentQuestion) {
    currentQuestion = unansweredQuestions.filter((question: { data: Question }) => action.data.key === question.data.key)[0];
  }
  // check questionSet, is title card
  if(!currentQuestion) {
    currentQuestion = questionSet.filter((question: { data: Question }) => action.data.key === question.data.key)[0];
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
    const answeredQuestionWithAttempts = answeredQuestionsWithAttempts[key]
    const unansweredQuestionWithAttempts = unansweredQuestionsWithAttempts[key]
    if(answeredQuestionWithAttempts) {
      return answeredQuestionWithAttempts;
    } else if(unansweredQuestionWithAttempts) {
      return unansweredQuestionWithAttempts;
    } else {
      return question;
    }
  });
}
