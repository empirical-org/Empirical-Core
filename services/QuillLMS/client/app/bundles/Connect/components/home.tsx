import * as React from 'react';
import { renderRoutes } from "react-router-config";
import { useQuery } from 'react-query';
import { Layout } from "antd";

import { NavBar } from './navbar/navbar';

import { routes } from "../routes";
import { getParameterByName } from '../libs/getParameterByName';
import { TeacherPreviewMenu } from '../../Shared/index';
import { fetchUserRole } from '../../Shared/utils/userAPIs';

interface PageLayoutState {
  showFocusState: boolean;
  previewShowing: boolean;
  questionToPreview: any;
  switchedBackToPreview: boolean;
  skippedToQuestionFromIntro: boolean;
}

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

  document.addEventListener('keydown', handleKeyDown);
  document.removeEventListener('keydown', handleKeyDown);

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
  let header;
  if(isTeacherOrAdmin && isPlaying) {
    header = <NavBar isTeacher={isTeacherOrAdmin} onTogglePreview={handleTogglePreviewMenu} previewShowing={previewShowing} />;
  } else if (!isTeacherOrAdmin && isPlaying) {
    header = <NavBar />;
  }
  return(
    <Layout className={className}>
      <Layout>
        {showPreview && <Layout.Sider
          breakpoint="md"
          className="sider-container"
          collapsedWidth="0"
          style={{ height: '100vh', overflowY: 'auto' }}
          width={360}
        >
          <TeacherPreviewMenu
            onHandleSkipToQuestionFromIntro={handleSkipToQuestionFromIntro}
            onTogglePreview={handleTogglePreviewMenu}
            onToggleQuestion={handleToggleQuestion}
            questionToPreview={questionToPreview}
            showPreview={previewShowing}
          />
        </Layout.Sider>}
        <Layout.Content style={{ height: '100vh', overflow: 'auto' }}>
          <button className="skip-main" onClick={handleSkipToMainContentClick} type="button">Skip to main content</button>
          {header}
          <div id="main-content" tabIndex={-1}>{renderRoutes(routes, {
            switchedBackToPreview: switchedBackToPreview,
            handleToggleQuestion: handleToggleQuestion,
            previewMode: showPreview,
            questionToPreview: questionToPreview,
            skippedToQuestionFromIntro: skippedToQuestionFromIntro
          })}</div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

export default Home;
