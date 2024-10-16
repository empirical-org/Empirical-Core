import * as React from 'react';
import { useQuery } from 'react-query';
import { connect } from 'react-redux';
import { renderRoutes } from "react-router-config";
import { withTranslation } from 'react-i18next';

import { NavBar } from './navbar/navbar';

import { addKeyDownListener } from '../../Shared/hooks/addKeyDownListener';
import i18n from '../../Shared/libs/translations/i18n';
import { ScreenreaderInstructions, TeacherPreviewMenu, getlanguageOptions, } from '../../Shared/index';
import { fetchUserRole } from '../../Shared/utils/userAPIs';
import { setLanguage } from '../actions.js';
import { lessonUid } from '../app';
import { getParameterByName } from '../libs/getParameterByName';
import { routes } from "../routes";

export const Home = ({ playLesson, lessons, dispatch, t }) => {
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
  const [languageOptions, setLanguageOptions] = React.useState<any>(null);

  React.useEffect(() => {
    if (!lessons?.hasreceiveddata) { return }
    const translations = lessons.data?.[lessonUid]?.translations ?? {};
    const formattedLanguageOptions = getlanguageOptions(translations)
    setLanguageOptions(formattedLanguageOptions);
  }, [lessons]);

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

  function handleUpdateLanguage(language: string) {
    i18n.changeLanguage(language);
    const action = setLanguage(language)
    dispatch(action)
  }

  let className = "ant-layout "
  className = showFocusState ? '' : 'hide-focus-outline'
  const showPreview = previewShowing && isTeacherOrAdmin && isPlaying;
  const isOnMobile = window.innerWidth < 1100;
  let header;
  if(isTeacherOrAdmin && isPlaying) {
    header = (<NavBar
      isOnMobile={isOnMobile}
      isTeacher={isTeacherOrAdmin}
      language={playLesson?.language}
      languageOptions={languageOptions}
      onTogglePreview={handleTogglePreviewMenu}
      previewShowing={previewShowing}
      translate={t}
      updateLanguage={handleUpdateLanguage}
    />);
  } else if (!isTeacherOrAdmin && isPlaying) {
    header = (<NavBar
      language={playLesson?.language}
      languageOptions={languageOptions}
      translate={t}
      updateLanguage={handleUpdateLanguage}
    />);
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
            availableLanguages: languageOptions?.map(option => option.value),
            isOnMobile: isOnMobile,
            switchedBackToPreview: switchedBackToPreview,
            handleToggleQuestion: handleToggleQuestion,
            handleTogglePreview: handleTogglePreviewMenu,
            previewMode: showPreview,
            questionToPreview: questionToPreview,
            skippedToQuestionFromIntro: skippedToQuestionFromIntro,
            updateLanguage: handleUpdateLanguage,
            language: playLesson?.language,
            translate: t
          })}</div>
        </main>
      </div>
    </div>
  );
}

const select = (state: any, props: any) => {
  return {
    playLesson: state.playLesson,
    lessons: state.lessons
  };
}

export default withTranslation()(connect(select)(Home));
