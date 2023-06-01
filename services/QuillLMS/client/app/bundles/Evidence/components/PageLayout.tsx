import * as React from "react";
import { renderRoutes } from "react-router-config";
import { useQuery } from 'react-query';

import Header from "./Header";

import { fetchUserRole } from '../../Shared/utils/userAPIs';
import { ScreenreaderInstructions, TeacherPreviewMenu } from '../../Shared/index';
import { routes } from "../routes";
import getParameterByName from '../helpers/getParameterByName';

const PageLayout: React.StatelessComponent<{}> = (props: any) => {
  const { user } = props;
  const studentSession = getParameterByName('student', window.location.href);
  const turkSession = getParameterByName('turk', window.location.href);
  const isPlaying = window.location.href.includes('play');
  const studentOrTurk = studentSession || turkSession;
  const { data } = useQuery("user-role", fetchUserRole);
  const isTeacherOrAdmin = data && data.role && data.role !== 'student';

  const [previewShowing, setPreviewShowing] = React.useState<boolean>(!studentOrTurk);
  console.log("🚀 ~ file: PageLayout.tsx:22 ~ previewShowing:", previewShowing)
  const [questionToPreview, setQuestionToPreview] = React.useState<any>(null);
  const [switchedBackToPreview, setSwitchedBackToPreview] = React.useState<boolean>(false);
  const [skippedToQuestionFromIntro, setSkippedToQuestionFromIntro] = React.useState<boolean>(false);

  function handleSkipToMainContentClick () {
    const element = document.getElementById("main-content")
    if (!element) { return }
    element.focus()
    element.scrollIntoView()
  }

  function handleTogglePreviewMenu() {
    if (previewShowing) {
      setSwitchedBackToPreview(false);
    } else {
      setSwitchedBackToPreview(true);
    }
    setPreviewShowing(!previewShowing);
  }

  function handleToggleQuestion(question: object) {
    setQuestionToPreview(question);
  }

  function handleSkipToQuestionFromIntro() {
    setSkippedToQuestionFromIntro(true);
  }

  const showPreview = previewShowing && isTeacherOrAdmin && isPlaying;
  const isOnMobile = window.innerWidth < 1100;

  return (
    <div className="app-container">
      <ScreenreaderInstructions />
      <button className="skip-main" onClick={handleSkipToMainContentClick} type="button">Skip to main content</button>
      <Header isOnMobile={isOnMobile} isTeacher={!studentOrTurk} onTogglePreview={handleTogglePreviewMenu} previewShowing={showPreview} />
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
        <div id="main-content" tabIndex={-1}>{renderRoutes(routes, {
          user,
          isOnMobile: isOnMobile,
          handleTogglePreviewMenu: handleTogglePreviewMenu,
          switchedBackToPreview: switchedBackToPreview,
          handleToggleQuestion: handleToggleQuestion,
          previewMode: showPreview,
          questionToPreview: questionToPreview,
          skippedToQuestionFromIntro: skippedToQuestionFromIntro
          })}</div>
      </div>
    </div>
  );
};

export default PageLayout;
