import * as React from 'react';
import { renderRoutes } from "react-router-config";
import { routes } from "../routes";
import { NavBar } from './navbar/studentNavbar.tsx';
import { Layout } from "antd";
import { getParameterByName } from '../libs/getParameterByName';
import TeacherPreviewMenu from '../../Teacher/components/shared/teacherPreviewMenu';

interface PageLayoutState {
  showFocusState: boolean;
  previewShowing: boolean;
  questionToPreview: any;
  switchedBackToPreview: boolean;
}
export default class Home extends React.Component<any, PageLayoutState> {
  constructor(props) {
    super(props);
    
    const studentSession = getParameterByName('student', window.location.href);

    this.state = { 
      showFocusState: false,
      previewShowing: !studentSession,
      questionToPreview: null,
      switchedBackToPreview: false
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
      this.setState({ questionToPreview: null, switchedBackToPreview: false });
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
  render() {
    const { showFocusState, previewShowing, questionToPreview, switchedBackToPreview } = this.state;
    const studentSession = getParameterByName('student', window.location.href);
    const isPlaying = window.location.href.includes('play');
    const showPreview = previewShowing && isPlaying;
    const className = showFocusState ? '' : 'hide-focus-outline'
    const studentOrTurk = window.location.href.includes('play') || window.location.href.includes('turk')
    let header;
    if(studentOrTurk && !studentSession) {
      header = <NavBar isTeacher={!studentSession} onTogglePreview={this.handleTogglePreviewMenu} previewShowing={previewShowing} />;
    } else if(studentOrTurk) {
      header = <NavBar />;
    }
    if(showPreview) {
      return(
        <Layout className={className}>
          <Layout>
            <Layout.Sider 
              breakpoint="md"
              className="sider-container" 
              collapsedWidth="0"
              width={360}
            >
              <TeacherPreviewMenu
                onTogglePreview={this.handleTogglePreviewMenu}
                onToggleQuestion={this.handleToggleQuestion}  
                questionToPreview={questionToPreview}
                showPreview={previewShowing}
              />
            </Layout.Sider>
            <Layout.Content>
              <button className="skip-main" onClick={this.handleSkipToMainContentClick} type="button">Skip to main content</button>
              {header}
              <div id="main-content" tabIndex={-1}>{renderRoutes(routes, {
                switchedBackToPreview: switchedBackToPreview,
                handleToggleQuestion: this.handleToggleQuestion, 
                previewMode: previewShowing, 
                questionToPreview: questionToPreview
              })}</div>
            </Layout.Content>
          </Layout>
        </Layout>
      );
    }
    return(
      <Layout className={className}>
        <Layout>
          <Layout.Content>
            {studentOrTurk && <button className="skip-main" onClick={this.handleSkipToMainContentClick} type="button">Skip to main content</button>}
            {header}
            <div id="main-content" tabIndex={-1}>{renderRoutes(routes)}</div>
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
};
