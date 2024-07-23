import * as React from 'react';
import { connect } from 'react-redux';
import { useQuery } from 'react-query';
import { renderRoutes } from "react-router-config";

import StudentNavBar from './navbar/studentNavbar';
import TeacherNavbar from './navbar/teacherNavbar';

import { addKeyDownListener } from '../../Shared/hooks/addKeyDownListener';
import { ScreenreaderInstructions, TeacherPreviewMenu, } from '../../Shared/index';
import { fetchUserRole } from '../../Shared/utils/userAPIs';
import { getParameterByName } from '../libs/getParameterByName';
import { routes } from "../routes";
import i18n from '../i18n';
import { updateLanguage } from '../actions/diagnostics.js';
// TODO: standardize Question Typescript interface definitions
import { Question } from '../../Grammar/interfaces/questions';

export const Home = ({ dispatch, playDiagnostic }) => {
  const studentSession = getParameterByName('student', window.location.href);
  const turkSession = window.location.href.includes('turk');
  const studentOrTurk = studentSession || turkSession;
  const isPlaying = window.location.href.includes('play');
  const { data: roleData } = useQuery("user-role", fetchUserRole);
  const isTeacherOrAdmin = roleData && roleData.role && roleData.role !== 'student';

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

  function handleToggleQuestion (question: Question) {
    setQuestionToPreview(question);
  }

  function handleSkipToQuestionFromIntro () {
    setSkippedToQuestionFromIntro(true);
  }

  function handleUpdateLanguage(language) {
    i18n.changeLanguage(language);
    dispatch(updateLanguage(language));
  }

  let className = "ant-layout "
  className = showFocusState ? '' : 'hide-focus-outline'
  const showPreview = previewShowing && isTeacherOrAdmin && isPlaying;
  const isOnMobile = window.innerWidth < 1100;
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
          {isPlaying && !isTeacherOrAdmin && <StudentNavBar language={playDiagnostic?.language} updateLanguage={handleUpdateLanguage} />}
          {isPlaying && isTeacherOrAdmin &&
            <TeacherNavbar
              isOnMobile={isOnMobile}
              onTogglePreview={handleTogglePreviewMenu}
              previewShowing={previewShowing}
              language={playDiagnostic?.language}
              updateLanguage={handleUpdateLanguage}
            />
          }
          <div id="main-content" tabIndex={-1}>{renderRoutes(routes, {
            isOnMobile: isOnMobile,
            handleTogglePreview: handleTogglePreviewMenu,
            switchedBackToPreview: switchedBackToPreview,
            handleToggleQuestion: handleToggleQuestion,
            previewMode: showPreview,
            questionToPreview: questionToPreview,
            skippedToQuestionFromIntro: skippedToQuestionFromIntro
          })}</div>
        </main>
      </div>
    </div>
  );
}

const select = (state: any, props: any) => {
  return {
    playDiagnostic: state.playDiagnostic
  };
}

export default connect(select)(Home);
