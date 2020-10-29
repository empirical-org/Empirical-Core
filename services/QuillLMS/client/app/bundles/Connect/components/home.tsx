import * as React from 'react';
import { renderRoutes } from "react-router-config";
import { routes } from "../routes";
import { NavBar } from './navbar/studentNavbar.tsx';
import { Layout } from "antd";
import { getParameterByName } from '../libs/getParameterByName';
import { TeacherPreviewMenu } from '../../Shared/index';

interface PageLayoutState {
  showFocusState: boolean;
  previewShowing: boolean;
  questionToPreview: any;
  switchedBackToPreview: boolean;
  skippedToQuestionFromIntro: boolean;
}
export default class Home extends React.Component<any, PageLayoutState> {
  constructor(props) {
    super(props);

    const studentOrTurkSession = getParameterByName('student', window.location.href) || window.location.href.includes('turk');

    this.state = {
      showFocusState: false,
      previewShowing: !studentOrTurkSession,
      questionToPreview: null,
      switchedBackToPreview: false,
      skippedToQuestionFromIntro: false
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown = (e: any) => {
    if (e.key !== 'Tab') { return }
    const { showFocusState, } = this.state
    if (showFocusState) { return }
    this.setState({ showFocusState: true })
  }

  handleSkipToMainContentClick = () => {
    const element = document.getElementById("main-content")
    element && element.focus()
    element && element.scrollIntoView()
  }

  handleTogglePreviewMenu = () => {
    const { previewShowing } = this.state;
    if(previewShowing) {
      this.setState({ switchedBackToPreview: false });
    } else {
      this.setState({ switchedBackToPreview: true });
    }
    this.setState(prevState => ({
      previewShowing: !prevState.previewShowing,
    }));
  }

  handleToggleQuestion = (question: object) => {
    this.setState({ questionToPreview: question });
  }

  handleSkipToQuestionFromIntro = () => {
    this.setState({ skippedToQuestionFromIntro: true });
  }

  render() {
    const { showFocusState, previewShowing, questionToPreview, switchedBackToPreview, skippedToQuestionFromIntro } = this.state;
    const studentSession = getParameterByName('student', window.location.href);
    const turkSession = window.location.href.includes('turk');
    const isPlaying = window.location.href.includes('play');
    const studentOrTurk = studentSession || turkSession
    const showPreview = previewShowing && isPlaying && !studentOrTurk;
    const previewMode = isPlaying && !studentOrTurk;
    const className = showFocusState ? '' : 'hide-focus-outline'
    let header;
    if(!studentOrTurk && isPlaying) {
      header = <NavBar isTeacher={!studentSession} onTogglePreview={this.handleTogglePreviewMenu} previewShowing={previewShowing} />;
    } else if (studentOrTurk && isPlaying) {
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
              onHandleSkipToQuestionFromIntro={this.handleSkipToQuestionFromIntro}
              onTogglePreview={this.handleTogglePreviewMenu}
              onToggleQuestion={this.handleToggleQuestion}
              questionToPreview={questionToPreview}
              showPreview={previewShowing}
            />
          </Layout.Sider>}
          <Layout.Content style={{ height: '100vh', overflow: 'auto' }}>
            <button className="skip-main" onClick={this.handleSkipToMainContentClick} type="button">Skip to main content</button>
            {header}
            <div id="main-content" tabIndex={-1}>{renderRoutes(routes, {
              switchedBackToPreview: switchedBackToPreview,
              handleToggleQuestion: this.handleToggleQuestion,
              previewMode: previewMode,
              questionToPreview: questionToPreview,
              skippedToQuestionFromIntro: skippedToQuestionFromIntro
            })}</div>
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
};
