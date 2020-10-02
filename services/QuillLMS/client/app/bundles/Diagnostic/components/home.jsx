import React from 'react';
import StudentNavBar from './navbar/studentNavbar';
import { TeacherNavbar } from './navbar/teacherNavbar';
import { Layout } from "antd";
import { renderRoutes } from "react-router-config";
import { routes } from "../routes";
import { getParameterByName } from '../libs/getParameterByName';
import { TeacherPreviewMenu } from '../../Shared/components/shared/teacherPreviewMenu';

export default class Home extends React.Component {
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
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown = (e) => {
    if (e.key !== 'Tab') { return }

    const { showFocusState, } = this.state

    if (showFocusState) { return }

    this.setState({ showFocusState: true })
  }

  handleSkipToMainContentClick = () => {
    const element = document.getElementById("main-content")
    element.focus()
    element.scrollIntoView()
  }

  handleTogglePreviewMenu = () => {
    const { previewShowing } = this.state;
    if(previewShowing) {
      this.setState({ questionToPreview: null, switchedBackToPreview: false });
    } else {
      this.setState({ switchedBackToPreview: true });
    }
    this.setState(prevState => ({
      previewShowing: !prevState.previewShowing,
    }));
  }

  handleToggleQuestion = (question) => {
    this.setState({ questionToPreview: question });
  }

  handleSkipToQuestionFromIntro = () => {
    this.setState({ skippedToQuestionFromIntro: true });
  }

  render() {
    const { showFocusState, previewShowing, questionToPreview, switchedBackToPreview, skippedToQuestionFromIntro } = this.state;
    let className = "ant-layout "
    className = showFocusState ? '' : 'hide-focus-outline'
    const isPlaying = window.location.href.includes('play');
    const studentSession = getParameterByName('student', window.location.href);
    const showPreview = previewShowing && isPlaying;
    const studentOrTurk = studentSession || window.location.href.includes('turk');
    const previewMode = isPlaying && !studentOrTurk;
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
            {isPlaying && studentOrTurk && <button className="skip-main" onClick={this.handleSkipToMainContentClick} type="button">Skip to main content</button>}
            {isPlaying && studentOrTurk && <StudentNavBar />}
            {isPlaying && !studentOrTurk && <TeacherNavbar onTogglePreview={this.handleTogglePreviewMenu} previewShowing={previewShowing} />}
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
