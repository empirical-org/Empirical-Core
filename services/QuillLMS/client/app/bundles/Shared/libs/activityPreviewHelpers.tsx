import * as React from 'react';
import { stripHtml } from "string-strip-html";
import clip from "text-clipper";
import ReactHtmlParser from 'react-html-parser';

import { BECAUSE, BUT, CHECKLIST, Feedback, INTRODUCTION, READ_AND_HIGHLIGHT, SO, getLatestAttempt } from '../../Shared/index';
import { QuestionObject, Activity } from '../interfaces';
import { PromptInterface } from '../../Staff/interfaces/evidenceInterfaces';

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

const getEvidenceStepStyling = (id: string, questionToPreview: string) => {
  return id === questionToPreview ? 'highlighted' : '';
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

function transformNode(node, index) {
  if (node.name === 'mark') {
    return node.children[0].data
  }
  if(node.name === 'strong') {
    node.name = 'i'
  }
}

const renderPassageAndPrompts = ({ passage, prompts, textIsExpanded, toggleExpandedText, handleEvidenceStepUpdate, questionToPreview }) => {
  if(!passage || !prompts) { return }

  const { text } = passage;
  const clippedHtml = textIsExpanded ? text : clip(text, 350, { html: true, maxLines: 10 });
  const buttonLabel = textIsExpanded ? 'Collapse text' : 'Preview the full text';
  const orderedPrompts = prompts.sort((prompt1: PromptInterface, prompt2: PromptInterface) => prompt1.conjunction.localeCompare(prompt2.conjunction));

  return(
    <React.Fragment>
      <div className="divider" />
      <section className="text-preview-section">
        <h2>Text</h2>
        {ReactHtmlParser(clippedHtml, {transform: transformNode})}
        <button className="interactive-wrapper toggle-text-button" onClick={toggleExpandedText}>{buttonLabel}</button>
      </section>
      <section className="prompt-preview-section">
        <i className="prompt-preview-instructions">Directions: Use information from the text to finish the sentence. Put the information in your own words.</i>
        <ul className="evidence-prompts">
          {orderedPrompts.map((prompt: PromptInterface) => {
            const { text, conjunction } = prompt;
            return (
              <button className={`question-container ${getEvidenceStepStyling(conjunction, questionToPreview) } focus-on-light`} id={conjunction} key={conjunction} onClick={handleEvidenceStepUpdate} type="button">
                <p className="question-text">{text}</p>
              </button>
            )
          })}
        </ul>
      </section>
    </React.Fragment>
  )
}

export const renderEvidenceActivityContent = ({ activity, toggleExpandedText, textIsExpanded, handleEvidenceStepUpdate, questionToPreview }) => {

  if(!activity) { return }

  const { prompts, passages } = activity

  return(
    <React.Fragment>
      <section className="evidence-content-section">
        <h2>What Students Will Do</h2>
        <section className="activity-steps-overview">
          <button className={`interactive-wrapper question-container ${getEvidenceStepStyling(INTRODUCTION, questionToPreview)} focus-on-light`} id={INTRODUCTION} onClick={handleEvidenceStepUpdate}>
            <p className="bullet-point">•</p>
            <p>Learn about Reading for Evidence.</p>
          </button>
          <button className={`interactive-wrapper question-container ${getEvidenceStepStyling(CHECKLIST, questionToPreview)} focus-on-light`} id={CHECKLIST}  onClick={handleEvidenceStepUpdate}>
            <p className="bullet-point">•</p>
            <p>See a checklist of the steps of the activity.</p>
          </button>
          <button className={`interactive-wrapper question-container ${getEvidenceStepStyling(READ_AND_HIGHLIGHT, questionToPreview)} focus-on-light`} id={READ_AND_HIGHLIGHT} onClick={handleEvidenceStepUpdate}>
            <p className="bullet-point">•</p>
            <p>Read a text and highlight sentences.</p>
          </button>
          <div className="sentence-stems-explanation-container">
            <p className="bullet-point">•</p>
            <p>Expand 3 sentence stems about the text using...</p>
          </div>
        </section>
        <ul>
          <li>
            <button className={`question-container ${getEvidenceStepStyling(BECAUSE, questionToPreview)} focus-on-light`} id={BECAUSE} onClick={handleEvidenceStepUpdate} type="button">
              <p className="question-number">1. </p>
              <p className="question-text">“because” to give a reason</p>
            </button>
          </li>
          <li>
            <button className={`question-container ${getEvidenceStepStyling(BUT, questionToPreview)} focus-on-light`} id={BUT} onClick={handleEvidenceStepUpdate} type="button">
              <p className="question-number">2. </p>
              <p className="question-text">“but” to give an opposing idea</p>
            </button>
          </li>
          <li>
            <button className={`question-container ${getEvidenceStepStyling(SO, questionToPreview)} focus-on-light`} id={SO} onClick={handleEvidenceStepUpdate} type="button">
              <p className="question-number">3. </p>
              <p className="question-text">“so” to give a result</p>
            </button>
          </li>
        </ul>
      </section>
      {renderPassageAndPrompts({ passage: passages[0], prompts, textIsExpanded, toggleExpandedText, handleEvidenceStepUpdate, questionToPreview })}
    </React.Fragment>
  );
}
