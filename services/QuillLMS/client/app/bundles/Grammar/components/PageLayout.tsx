import * as React from "react";
import {renderRoutes} from "react-router-config";
import { useQuery } from 'react-query';

import { Header } from "./Header";

import { routes } from "../routes";
import { fetchUserRole } from '../../Shared/utils/userAPIs';
import getParameterByName from '../helpers/getParameterByName';
import { TeacherPreviewMenu, ScreenreaderInstructions, } from '../../Shared/index';
import { addKeyDownListener } from '../../Shared/hooks/addKeyDownListener';
import { setCurrentQuestion } from '../actions/session';

export const PageLayout = () => {

  const studentSession = getParameterByName('student', window.location.href);
  const proofreaderSession = getParameterByName('proofreaderSessionId', window.location.href);
  const turkSession = window.location.href.includes('turk');
  const studentOrTurkOrProofreader = studentSession || turkSession || proofreaderSession;
  const isPlaying = window.location.href.includes('play');
  const { data } = useQuery("user-role", fetchUserRole);
  const isTeacherOrAdmin = data && data.role && data.role !== 'student';

  const [showFocusState, setShowFocusState] = React.useState<boolean>(false);
  const [previewShowing, setPreviewShowing] = React.useState<boolean>(!studentOrTurkOrProofreader);
  const [questionToPreview, setQuestionToPreview] = React.useState<any>(null);
  const [switchedBackToPreview, setSwitchedBackToPreview] = React.useState<boolean>(false);
  const [skippedToQuestionFromIntro, setSkippedToQuestionFromIntro] = React.useState<boolean>(false);

  function handleKeyDown (e: any) {
    if (e.key !== 'Tab') { return }
    if (showFocusState) { return }

    setShowFocusState(true);
  }

  addKeyDownListener(handleKeyDown);

  function handleSkipToMainContentClick () {
    const element = document.getElementById("main-content")
    if (!element) { return }
    element.focus()
    element.scrollIntoView()
  }

  function handleTogglePreviewMenu () {
    if(previewShowing) {
      setSwitchedBackToPreview(false);
    } else {
      setSwitchedBackToPreview(true);
    }
    setPreviewShowing(!previewShowing);
  }

  function handleToggleQuestion (question: object) {
    setQuestionToPreview(question);
  }

  function handleSkipToQuestionFromIntro () {
    setSkippedToQuestionFromIntro(true);
  }

  function renderContent (header: JSX.Element, showPreview: boolean, isOnMobile: boolean) {
    return(
      <main style={{ height: '100vh', overflow: 'auto' }}>
        <ScreenreaderInstructions />
        <button className="skip-main" onClick={handleSkipToMainContentClick} type="button">Skip to main content</button>
        {header}
        <div id="main-content" tabIndex={-1}>{renderRoutes(routes, {
          isOnMobile: isOnMobile,
          handleTogglePreviewMenu: handleTogglePreviewMenu,
          switchedBackToPreview: switchedBackToPreview,
          handleToggleQuestion: handleToggleQuestion,
          previewMode: showPreview,
          questionToPreview: questionToPreview,
          skippedToQuestionFromIntro: skippedToQuestionFromIntro
        })}</div>
      </main>
    );
  }

  const showPreview = previewShowing && isTeacherOrAdmin && isPlaying;
  const isOnMobile = window.innerWidth < 1100;
  let className = "ant-layout ";
  className += showFocusState ? '' : 'hide-focus-outline';
  let header;

  if(isPlaying && isTeacherOrAdmin) {
    header = <Header isOnMobile={isOnMobile} isTeacher={!studentOrTurkOrProofreader} onTogglePreview={handleTogglePreviewMenu} previewShowing={showPreview} />;
  } else if(isPlaying) {
    header = <Header />;
  }

  return(
    <div className={className}>
      <div className="activity-container">
        {showPreview && <aside
          className="sider-container"
          style={{ height: '100vh', overflowY: 'auto', width: '360px' }}
        >
          <TeacherPreviewMenu
            isOnMobile={isOnMobile}
            onHandleSkipToQuestionFromIntro={handleSkipToQuestionFromIntro}
            onTogglePreview={handleTogglePreviewMenu}
            onToggleQuestion={handleToggleQuestion}
            questionToPreview={questionToPreview}
            showPreview={previewShowing}
          />
        </aside>}
        {renderContent(header, showPreview, isOnMobile)}
      </div>
    </div>
  );
}

export default PageLayout;
