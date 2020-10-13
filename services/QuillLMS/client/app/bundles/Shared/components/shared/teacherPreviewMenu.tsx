import * as React from "react";
import * as Redux from "redux";
import { connect } from "react-redux";
import stripHtml from "string-strip-html";

import { getActivity } from "../../../Grammar/actions/grammarActivities";
import getParameterByName from "../../../Grammar/helpers/getParameterByName";
import { Question } from '../../../Grammar/interfaces/questions';
import { setCurrentQuestion } from '../../../Diagnostic/actions/diagnostics.js';

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
  const { grammarActivities, lessons } = state;
  if(isGrammarActivity) {
    return grammarActivities.currentActivity;
  } else if(isDiagnosticActivity && lessons && lessons.data) {
    const uid = window.location.href.split('/').slice(-1)[0];
    return lessons.data[uid]
  } else if(isConnectActivity && lessons && lessons.data) {
    const uid = Object.keys(lessons.data)[0];
    return lessons.data[uid]
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
  return key === uidOrKey || (i === 0 && !key) ? 'highlighted' : '';
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
  randomizedQuestions,
  sentenceFragments,
  session,
  titleCards
}) => {
  if(!activity && !randomizedQuestions && !session) {
    return null;
  // some Grammar activities return an empty array for the questions property so we check it's length
  } else if(activity && activity.questions && activity.questions.length) {
    return activity.questions.map((question: any, i: number) => {
      const { key } = question;
      const questionObject = getQuestionObject({ questions, titleCards, sentenceFragments, fillInBlank, key });
      const questionText = questionObject.prompt || questionObject.title
      const highlightedStyle = getStyling({ questionToPreview, uidOrKey: key, i, session, lesson });
      const indentation = getIndentation(i);
      if(!questionObject) {
        return null;
      }
      return(
        <button className={`question-container ${highlightedStyle} focus-on-light`} id={key} key={key} onClick={handleQuestionUpdate} type="button">
          <p className={`question-number ${indentation}`}>{`${i + 1}.  `}</p>
          <p className="question-text">{stripHtml(questionText)}</p>
        </button>
      );
    })
  } else if(randomizedQuestions) {
    return randomizedQuestions.map((question: any, i: number) => {
      const { uid } = question;
      const highlightedStyle = getStyling({ questionToPreview, uidOrKey: uid, i, session, lesson });
      const indentation = getIndentation(i);
      return(
        <button className={`question-container ${highlightedStyle} focus-on-light`} id={uid} key={uid} onClick={handleQuestionUpdate} type="button">
          <p className={`question-number ${indentation}`}>{`${i + 1}.  `}</p>
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
  onHandleSkipToQuestionFromIntro: () => void;
  onTogglePreview?: () => void;
  onToggleQuestion?: (question: Question) => void;
  onUpdateRandomizedQuestions?: (questions: any[]) => void;
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
  onHandleSkipToQuestionFromIntro,
  onTogglePreview,
  onToggleQuestion,
  onUpdateRandomizedQuestions,
  lesson,
  questions,
  questionToPreview,
  sentenceFragments,
  session,
  showPreview,
  titleCards
}: TeacherPreviewMenuProps) => {

  const [randomizedQuestions, setRandomizedQuestions] = React.useState<Question[]>();

  React.useEffect(() => {
    // we need to fetch grammar activities here
    const activityUID = getParameterByName('uid', window.location.href);
    if (activityUID) {
      dispatch(getActivity(activityUID))
    }
    if(!randomizedQuestions && session && session.hasreceiveddata && session.currentQuestion) {
      const activityQuestions = [session.currentQuestion, ...session.unansweredQuestions];
      setRandomizedQuestions(activityQuestions);
      onUpdateRandomizedQuestions(activityQuestions);
      if(!questionToPreview) {
        onToggleQuestion(session.currentQuestion);
      }
    }
  }, [session]);

  const handleToggleMenu = () => {
    onTogglePreview();
  }

  const handleQuestionUpdate = (e: React.SyntheticEvent) => {
    const questionUID = e.currentTarget.id;
    let question: Question;
    if(randomizedQuestions) {
      question = randomizedQuestions.filter(question => question.uid === questionUID)[0];
    } else {
      question = questions && questions[questionUID] || titleCards && titleCards[questionUID] || sentenceFragments && sentenceFragments[questionUID] || fillInBlank && fillInBlank[questionUID];
      question.key = questionUID;
    }
    // again we use session for Grammar and playLesson for Connect
    if(!questionToPreview) {
      onHandleSkipToQuestionFromIntro();
    }
    const action = setCurrentQuestion(question);
    dispatch(action);
    onToggleQuestion(question);
  }

  const hiddenStyle = !showPreview ? 'hidden' : '';

  return (
    <aside className={`teacher-preview-menu-container ${hiddenStyle}`}>
      <section className="header-container">
        <h1>Menu</h1>
        <button className="close-preview-button focus-on-light" onClick={handleToggleMenu} type="button">
          <img alt="close-preview-button" src={`${process.env.CDN_URL}/images/icons/close.svg`} />
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
            randomizedQuestions,
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
