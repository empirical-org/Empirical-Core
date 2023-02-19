import * as React from "react";
import * as Redux from "redux";
import { connect } from "react-redux";
import stripHtml from "string-strip-html";

import { Question } from '../../../Grammar/interfaces/questions';
import * as diagnosticActions from '../../../Diagnostic/actions/diagnostics.js';
import * as connectActions from '../../../Connect/actions';
import * as grammarActions from '../../../Grammar/actions/session';

interface Activity {
  title?: string;
  name?: string;
  questions?: {
    key: string;
  }[];
  description?: string;
  landingPageHtml?: string;
  questionType?: string;
  flag?: string;
  modelConceptUID?: string;
}

const isConnectActivity = window.location.href.includes('connect');
const isDiagnosticActivity = window.location.href.includes('diagnostic');
const isGrammarActivity = window.location.href.includes('grammar');

const returnActivity = (state: any) => {
  const { grammarActivities, lessons, playDiagnostic } = state;
  if(isGrammarActivity) {
    return grammarActivities.currentActivity;
  } else if(isDiagnosticActivity && playDiagnostic && playDiagnostic.diagnosticID && lessons && lessons.data) {
    const { data } = lessons;
    const { diagnosticID } = playDiagnostic;
    return data[diagnosticID]
  } else if(isConnectActivity && lessons && lessons.data) {
    const { data } = lessons;
    const uid = Object.keys(lessons.data)[0];
    return data[uid]
  }
  return null;
}

const returnActivityData = (activityData: { data: object }) => {
  const { data } = activityData;
  if(data && Object.keys(data).length === 0) {
    return null;
  }
  return data;
}

const returnLessonData = (playDiagnostic: any, playLesson: any) => {
  if(isConnectActivity) {
    return playLesson;
  } else if(isDiagnosticActivity) {
    return playDiagnostic;
  } else {
    return null;
  }
}

const renderTitleSection = (activity: Activity) => {
  if (!activity) { return }
  return(
    <section>
      <h2>Activity</h2>
      <p>{activity.title || activity.name}</p>
    </section>
  );
}

const renderIntroductionSection = (activity: Activity, lesson: any, session: any) => {
  if(!activity) { return }
  const isEmptyIntroduction = activity.landingPageHtml && !stripHtml(activity.landingPageHtml);
  if(activity && (!activity.landingPageHtml || isEmptyIntroduction)) { return }

  const introductionHTML = new DOMParser().parseFromString(activity.landingPageHtml, 'text/html');
  // we strip HTML because some activites have h3 introduction text wrapped in <strong> tags
  const htmlElement = introductionHTML.getElementsByTagName('h3')[0];
  const introductionText = htmlElement && htmlElement.innerHTML ? stripHtml(htmlElement.innerHTML) : null;
  // in some cases, landing pages do not have h3 headers so we early return to prevent the page from crashing
  if(!introductionText) {
    return;
  }
  // highlight introduction session if activity not started, we use session for Grammar and playLesson for Connect
  const style = ((session && !session.currentQuestion) || (lesson && !lesson.currentQuestion)) ? 'highlighted' : '';
  return(
    <section>
      <h2>Introduction</h2>
      <p className={`introduction-text ${style}`}>{introductionText}</p>
    </section>
  );
}

const getStyling = ({ questionToPreview, uidOrKey, i, session, lesson }) => {
  // some ELL SC questions get an -esp appended to the key
  const slicedUidOrKey = uidOrKey.slice(0, -4);
  let key: string;
  if(isDiagnosticActivity && lesson && lesson.currentQuestion) {
    const { data } = lesson.currentQuestion;
    key = data.key;
  } else if(questionToPreview) {
    key = questionToPreview.key ? questionToPreview.key : questionToPreview.uid;
  }
  // don't apply highlight if activity has not started
  if((session && !session.currentQuestion) || (lesson && !lesson.currentQuestion)) {
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
  if(questions && questions[key] && questions[key].prompt) {
    questionObject = questions[key];
    questionObject.type = 'SC';
  } else if(titleCards && titleCards[key]) {
    questionObject = titleCards[key];
    questionObject.type = 'TL';
  } else if(sentenceFragments && sentenceFragments[key]) {
    questionObject = sentenceFragments[key];
    questionObject.type = 'SF';
  } else if(fillInBlank && fillInBlank[key]) {
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

const renderQuestions = ({
  activity,
  fillInBlank,
  handleQuestionUpdate,
  lesson,
  questions,
  questionToPreview,
  sentenceFragments,
  session,
  titleCards
}) => {
  if(!activity && !session) {
    return null;
  // some Grammar activities return an empty array for the questions property so we check it's length
  } else if(activity && activity.questions && activity.questions.length) {
    const questionsWithoutTitleCards = activity.questions.filter(question => question.questionType !== 'titleCards');
    return activity.questions.map((question: any, i: number) => {
      const { key } = question;
      const index = questionsWithoutTitleCards.indexOf(question);
      const questionNumber = index !== -1 ? `${index + 1}.  ` : '';
      const questionObject = getQuestionObject({ questions, titleCards, sentenceFragments, fillInBlank, key });
      const questionText = questionObject.prompt || questionObject.title
      const highlightedStyle = getStyling({ questionToPreview, uidOrKey: key, i, session, lesson });
      const indentationStyle = getIndentation(i);
      const titleCardStyle = !questionNumber ? 'inverted-indent' :'';
      if(!questionObject) {
        return null;
      }
      return(
        <button className={`question-container ${highlightedStyle} ${titleCardStyle} focus-on-light`} id={key} key={key} onClick={handleQuestionUpdate} type="button">
          {questionNumber && <p className={`question-number ${indentationStyle}`}>{questionNumber}</p>}
          <p className="question-text">{stripHtml(questionText)}</p>
        </button>
      );
    })
  } else if(session && session.questionSet) {
    return session.questionSet.map((question: any, i: number) => {
      const { uid } = question;
      const highlightedStyle = getStyling({ questionToPreview, uidOrKey: uid, i, session, lesson });
      const indentationStyle = getIndentation(i);
      return(
        <button className={`question-container ${highlightedStyle} focus-on-light`} id={uid} key={uid} onClick={handleQuestionUpdate} type="button">
          <p className={`question-number ${indentationStyle}`}>{`${i + 1}.  `}</p>
          <p className="question-text">{stripHtml(question.prompt)}</p>
        </button>
      );
    });
  }
}

interface TeacherPreviewMenuProps {
  activity: Activity;
  dispatch: Function;
  fillInBlank: any[];
  isOnMobile: boolean;
  onHandleSkipToQuestionFromIntro: () => void;
  onTogglePreview?: () => void;
  onToggleQuestion?: (question: Question) => void;
  lesson: any;
  questions: Question[];
  questionToPreview?: {
    key?: string,
    uid?: string
  };
  sentenceFragments: any[];
  session: any;
  showPreview: boolean;
  titleCards: any;
}

const TeacherPreviewMenuComponent = ({
  activity,
  dispatch,
  fillInBlank,
  isOnMobile,
  onHandleSkipToQuestionFromIntro,
  onTogglePreview,
  onToggleQuestion,
  lesson,
  questions,
  questionToPreview,
  sentenceFragments,
  session,
  showPreview,
  titleCards
}: TeacherPreviewMenuProps) => {

  const handleToggleMenu = () => {
    onTogglePreview();
  }

  const handleQuestionUpdate = (e: React.SyntheticEvent) => {
    const questionUID = e.currentTarget.id;
    let question: Question;
    question = questions && questions[questionUID] || titleCards && titleCards[questionUID] || sentenceFragments && sentenceFragments[questionUID] || fillInBlank && fillInBlank[questionUID];
    question.key = questionUID;
    question.uid = questionUID;
    // again we use session for Grammar and playLesson for Connect
    if(!questionToPreview) {
      onHandleSkipToQuestionFromIntro();
    }
    let action;
    if(isDiagnosticActivity) {
      action = diagnosticActions.setCurrentQuestion(question)
    } else if(isConnectActivity) {
      action = connectActions.setCurrentQuestion(question);
    } else {
      action = grammarActions.setCurrentQuestion(question);
    }
    dispatch(action);
    onToggleQuestion(question);
  }

  const hiddenStyle = !showPreview ? 'hidden' : '';

  return (
    <aside className={`teacher-preview-menu-container ${hiddenStyle}`}>
      <section className="header-container">
        <h1>Menu</h1>
        <button className="close-preview-button focus-on-light" onClick={handleToggleMenu} type="button">
          <img alt="close-preview-button" src={`${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/close.svg`} />
          {isOnMobile && <p className="close-text">Close</p>}
        </button>
      </section>
      <section className="preview-section">
        <h2>Preview Mode</h2>
        <p>This menu only displays for teachers previewing an activity. Students will not be able to skip questions.</p>
      </section>
      {renderTitleSection(activity)}
      {renderIntroductionSection(activity, lesson, session)}
      <section>
        <h2>Questions</h2>
        <ul>
          {renderQuestions({
            activity,
            fillInBlank,
            handleQuestionUpdate,
            lesson,
            questions,
            questionToPreview,
            sentenceFragments,
            session,
            titleCards
          })}
        </ul>
      </section>
    </aside>
  );
}

const mapStateToProps = (state: any) => {
  const { questions, session, titleCards, sentenceFragments, fillInBlank, playLesson, playDiagnostic } = state;
  return {
    activity: returnActivity(state),
    fillInBlank: fillInBlank ? returnActivityData(fillInBlank) : null,
    lesson: returnLessonData(playDiagnostic, playLesson),
    questions: questions ? returnActivityData(questions) : null,
    sentenceFragments: sentenceFragments ? returnActivityData(sentenceFragments) : null,
    session: session,
    titleCards: titleCards ? returnActivityData(titleCards) : null,
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch<any>) => {
  return {
    dispatch
  };
};

export const TeacherPreviewMenu = connect(mapStateToProps, mapDispatchToProps)(TeacherPreviewMenuComponent);
