import * as React from 'react';
import { useQuery } from 'react-query';
import { renderRoutes } from "react-router-config";

import { NavBar } from './navbar/navbar';

import { addKeyDownListener } from '../../Shared/hooks/addKeyDownListener';
import { ScreenreaderInstructions, TeacherPreviewMenu } from '../../Shared/index';
import { fetchUserRole } from '../../Shared/utils/userAPIs';
import { getParameterByName } from '../libs/getParameterByName';
import { routes } from "../routes";

export const Home = () => {
  const studentSession = getParameterByName('student', window.location.href);
  const turkSession = window.location.href.includes('turk');
  const studentOrTurk = studentSession || turkSession;
  const isPlaying = window.location.href.includes('play');
  const { data } = useQuery("user-role", fetchUserRole);
  const isTeacherOrAdmin = data && data.role && data.role !== 'student';

  const [showFocusState, setShowFocusState] = React.useState<boolean>(false);
  const [previewShowing, setPreviewShowing] = React.useState<boolean>(!studentOrTurk);
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

  let className = "ant-layout "
  className = showFocusState ? '' : 'hide-focus-outline'
  const showPreview = previewShowing && isTeacherOrAdmin && isPlaying;
  const isOnMobile = window.innerWidth < 1100;
  let header;
  if(isTeacherOrAdmin && isPlaying) {
    header = <NavBar isOnMobile={isOnMobile} isTeacher={isTeacherOrAdmin} onTogglePreview={handleTogglePreviewMenu} previewShowing={previewShowing} />;
  } else if (!isTeacherOrAdmin && isPlaying) {
    header = <NavBar />;
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
        <main style={{ height: '100vh', overflow: 'auto' }}>
          <ScreenreaderInstructions />
          <button className="skip-main" onClick={handleSkipToMainContentClick} type="button">Skip to main content</button>
          {header}
          <div id="main-content" tabIndex={-1}>{renderRoutes(routes, {
            isOnMobile: isOnMobile,
            switchedBackToPreview: switchedBackToPreview,
            handleToggleQuestion: handleToggleQuestion,
            handleTogglePreview: handleTogglePreviewMenu,
            previewMode: showPreview,
            questionToPreview: questionToPreview,
            skippedToQuestionFromIntro: skippedToQuestionFromIntro
          })}</div>
        </main>
      </div>
    </div>
  );
}

export default Home;
