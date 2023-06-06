import * as React from "react";
import { connect } from "react-redux";
import * as Redux from "redux";
import { stripHtml } from "string-strip-html";

import * as connectActions from '../../../Connect/actions';
import * as diagnosticActions from '../../../Diagnostic/actions/diagnostics.js';
import * as grammarActions from '../../../Grammar/actions/session';
import { Question } from '../../../Grammar/interfaces/questions';
import {
  returnActivity,
  returnActivityData,
  returnLessonData,
  renderTitleSection,
  renderIntroductionSection,
  renderQuestions,
  renderEvidenceActivityContent
} from "../../libs";

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
const isEvidenceActivity = window.location.href.includes('evidence');

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

  const [textIsExpanded, setTextIsExpanded] = React.useState<boolean>(false);

  function toggleExpandedText() {
    setTextIsExpanded(!textIsExpanded)
  }
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
        <h1>Preview Menu</h1>
        <button className="close-preview-button focus-on-light" onClick={handleToggleMenu} type="button">
          <img alt="close-preview-button" src={`${process.env.CDN_URL}/images/icons/close.svg`} />
          {isOnMobile && <p className="close-text">Close</p>}
        </button>
      </section>
      <section className="preview-section">
        <h2>Preview Mode</h2>
        <p>This menu only displays for teachers previewing an activity. Students will not be able to skip questions.</p>
      </section>
      {renderTitleSection(activity)}
      {renderIntroductionSection(activity, lesson, session)}
      {!isEvidenceActivity && <section>
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
            titleCards,
            isDiagnosticActivity
          })}
        </ul>
      </section>}
      {isEvidenceActivity && renderEvidenceActivityContent({
        activity,
        handleQuestionUpdate,
        toggleExpandedText,
        textIsExpanded
      })}
    </aside>
  );
}

const mapStateToProps = (state: any) => {
  const { questions, session, titleCards, sentenceFragments, fillInBlank, playLesson, playDiagnostic } = state;
  return {
    activity: returnActivity({ state, isGrammarActivity, isDiagnosticActivity, isConnectActivity, isEvidenceActivity }),
    fillInBlank: fillInBlank ? returnActivityData(fillInBlank) : null,
    lesson: returnLessonData({ playDiagnostic, playLesson, isConnectActivity, isDiagnosticActivity }),
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
