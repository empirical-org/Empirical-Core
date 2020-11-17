import * as React from 'react';
import { Layout } from "antd";
import { renderRoutes } from "react-router-config";
import { useQuery } from 'react-query';

import StudentNavBar from './navbar/studentNavbar';
import TeacherNavbar from './navbar/teacherNavbar';

import { routes } from "../routes";
import { getParameterByName } from '../libs/getParameterByName';
import { TeacherPreviewMenu } from '../../Shared/components/shared/teacherPreviewMenu';
import { fetchUserRole } from '../../Shared/utils/userAPIs';

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
          {isPlaying && !isTeacherOrAdmin && <button className="skip-main" onClick={handleSkipToMainContentClick} type="button">Skip to main content</button>}
          {isPlaying && !isTeacherOrAdmin && <StudentNavBar />}
          {isPlaying && isTeacherOrAdmin && <TeacherNavbar onTogglePreview={handleTogglePreviewMenu} previewShowing={previewShowing} />}
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
