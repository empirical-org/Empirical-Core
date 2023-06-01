import * as React from 'react';
import { stripHtml } from "string-strip-html";

import { Feedback, getLatestAttempt } from '../../Shared/index';
import { QuestionObject, Activity } from '../interfaces';

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
  const strippedFeedback = feedback ? stripHtml(feedback).result : '';

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

export const returnActivity = ({ state, isGrammarActivity, isDiagnosticActivity, isConnectActivity, isEvidenceActivity }) => {
  const { grammarActivities, lessons, playDiagnostic, activities } = state;
  if (isGrammarActivity) {
    return grammarActivities.currentActivity;
  } else if (isDiagnosticActivity && playDiagnostic && playDiagnostic.diagnosticID && lessons && lessons.data) {
    const { data } = lessons;
    const { diagnosticID } = playDiagnostic;
    return data[diagnosticID]
  } else if (isConnectActivity && lessons && lessons.data) {
    const { data } = lessons;
    const uid = Object.keys(lessons.data)[0];
    return data[uid]
  } else if (isEvidenceActivity) {
    const { currentActivity } = activities;
    return currentActivity;
  }
  return null;
}

export const returnActivityData = (activityData: { data: object }) => {
  const { data } = activityData;
  if (data && Object.keys(data).length === 0) {
    return null;
  }
  return data;
}

export const returnLessonData = ({ playDiagnostic, playLesson, isConnectActivity, isDiagnosticActivity }) => {
  if (isConnectActivity) {
    return playLesson;
  } else if (isDiagnosticActivity) {
    return playDiagnostic;
  } else {
    return null;
  }
}

export const renderTitleSection = (activity: Activity) => {
  if (!activity) { return }
  return (
    <React.Fragment>
      <div className="divider" />
      <section className="title-section">
        <h2>Activity</h2>
        <p>{activity.title || activity.name}</p>
      </section>
      <div className="divider" />
    </React.Fragment>
  );
}

export const renderIntroductionSection = (activity: Activity, lesson: any, session: any) => {
  if (!activity) { return }
  const isEmptyIntroduction = activity.landingPageHtml && !stripHtml(activity.landingPageHtml).result;
  if (activity && (!activity.landingPageHtml || isEmptyIntroduction)) { return }

  const introductionHTML = new DOMParser().parseFromString(activity.landingPageHtml, 'text/html');
  // we strip HTML because some activites have h3 introduction text wrapped in <strong> tags
  const htmlElement = introductionHTML.getElementsByTagName('h3')[0];
  const introductionText = htmlElement && htmlElement.innerHTML ? stripHtml(htmlElement.innerHTML).result : null;
  // in some cases, landing pages do not have h3 headers so we early return to prevent the page from crashing
  if (!introductionText) {
    return;
  }
  // highlight introduction session if activity not started, we use session for Grammar and playLesson for Connect
  const style = ((session && !session.currentQuestion) || (lesson && !lesson.currentQuestion)) ? 'highlighted' : '';
  return (
    <section>
      <h2>Introduction</h2>
      <p className={`introduction-text ${style}`}>{introductionText}</p>
    </section>
  );
}

const getStyling = ({ questionToPreview, uidOrKey, i, session, lesson, isDiagnosticActivity }) => {
  // some ELL SC questions get an -esp appended to the key
  const slicedUidOrKey = uidOrKey.slice(0, -4);
  let key: string;
  if (isDiagnosticActivity && lesson && lesson.currentQuestion) {
    const { data } = lesson.currentQuestion;
    key = data.key;
  } else if (questionToPreview) {
    key = questionToPreview.key ? questionToPreview.key : questionToPreview.uid;
  }
  // don't apply highlight if activity has not started
  if ((session && !session.currentQuestion) || (lesson && !lesson.currentQuestion)) {
    return '';
  }
  // if first question has no key from initial render, apply highlight
  return key === uidOrKey || key === slicedUidOrKey || (i === 0 && !key) ? 'highlighted' : '';
}

const getIndentation = (i: number) => {
  return i < 9 ? 'indented' : '';
}

const getQuestionObject = ({ questions, titleCards, sentenceFragments, fillInBlank, key }) => {
  let questionObject;
  if (questions && questions[key] && questions[key].prompt) {
    questionObject = questions[key];
    questionObject.type = 'SC';
  } else if (titleCards && titleCards[key]) {
    questionObject = titleCards[key];
    questionObject.type = 'TL';
  } else if (sentenceFragments && sentenceFragments[key]) {
    questionObject = sentenceFragments[key];
    questionObject.type = 'SF';
  } else if (fillInBlank && fillInBlank[key]) {
    questionObject = fillInBlank[key];
    questionObject.type = 'FB';
  } else {
    return {
      prompt: '',
      title: ''
    }
  }
  return questionObject;
}

export const renderQuestions = ({
  activity,
  fillInBlank,
  handleQuestionUpdate,
  lesson,
  questions,
  questionToPreview,
  sentenceFragments,
  session,
  titleCards,
  isDiagnosticActivity
}) => {
  if (!activity && !session) {
    return null;
    // some Grammar activities return an empty array for the questions property so we check it's length
  } else if (activity && activity.questions && activity.questions.length) {
    const questionsWithoutTitleCards = activity.questions.filter(question => question.questionType !== 'titleCards');
    return activity.questions.map((question: any, i: number) => {
      const { key } = question;
      const index = questionsWithoutTitleCards.indexOf(question);
      const questionNumber = index !== -1 ? `${index + 1}.  ` : '';
      const questionObject = getQuestionObject({ questions, titleCards, sentenceFragments, fillInBlank, key });
      const questionText = questionObject.prompt || questionObject.title
      const highlightedStyle = getStyling({ questionToPreview, uidOrKey: key, i, session, lesson, isDiagnosticActivity });
      const indentationStyle = getIndentation(i);
      const titleCardStyle = !questionNumber ? 'inverted-indent' : '';
      if (!questionObject) {
        return null;
      }
      return (
        <button className={`question-container ${highlightedStyle} ${titleCardStyle} focus-on-light`} id={key} key={key} onClick={handleQuestionUpdate} type="button">
          {questionNumber && <p className={`question-number ${indentationStyle}`}>{questionNumber}</p>}
          <p className="question-text">{stripHtml(questionText).result}</p>
        </button>
      );
    })
  } else if (session && session.questionSet) {
    return session.questionSet.map((question: any, i: number) => {
      const { uid } = question;
      const highlightedStyle = getStyling({ questionToPreview, uidOrKey: uid, i, session, lesson, isDiagnosticActivity });
      const indentationStyle = getIndentation(i);
      return (
        <button className={`question-container ${highlightedStyle} focus-on-light`} id={uid} key={uid} onClick={handleQuestionUpdate} type="button">
          <p className={`question-number ${indentationStyle}`}>{`${i + 1}.  `}</p>
          <p className="question-text">{stripHtml(question.prompt).result}</p>
        </button>
      );
    });
  }
}
