import * as React from "react";
import { Layout } from "antd";
import { Header } from "./Header";
import {renderRoutes} from "react-router-config";
import { routes } from "../routes";
import getParameterByName from '../helpers/getParameterByName';
import TeacherPreviewMenu from '../../Teacher/components/shared/teacherPreviewMenu';

interface PageLayoutState {
  showFocusState: boolean;
  previewShowing: boolean;
  questionToPreview: object;
}

export default class PageLayout extends React.Component<any, PageLayoutState> {
  constructor(props: any) {
    super(props)

    this.state = { 
      showFocusState: false,
      previewShowing: true,
      questionToPreview: null
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
    if (!element) { return }
    element.focus()
    element.scrollIntoView()
  }

  handleTogglePreviewMenu = () => {
    this.setState(prevState => ({ previewShowing: !prevState.previewShowing }));
  }

  handleToggleQuestion = (question: object) => {
    this.setState({ questionToPreview: question });
  }

  render() {
    const { showFocusState, previewShowing, questionToPreview } = this.state;
    const studentSession = getParameterByName('student', window.location.href);
    const isPlaying = window.location.href.includes('play');
    const showPreview = previewShowing && isPlaying && !studentSession;
    let className = "ant-layout ";
    className = showFocusState ? '' : 'hide-focus-outline';
    let header;

    if(isPlaying && !studentSession) {
      header = <Header onTogglePreview={this.handleTogglePreviewMenu} previewShowing={previewShowing} />;
    } else if(isPlaying) {
      header = <Header />;
    }
    if(showPreview) {
      return(
        <Layout className={className}>
          <Layout>
            <Layout.Sider className="sider-container" width={360}>
              <TeacherPreviewMenu
                onTogglePreview={this.handleTogglePreviewMenu}
                onToggleQuestion={this.handleToggleQuestion} 
                showPreview={previewShowing} 
              />
            </Layout.Sider>
            <Layout.Content>
              <button className="skip-main" onClick={this.handleSkipToMainContentClick} type="button">Skip to main content</button>
              {header}
              <div id="main-content" tabIndex={-1}>{renderRoutes(routes, {previewMode: previewShowing, questionToPreview: questionToPreview})}</div>
            </Layout.Content>
          </Layout>
        </Layout>
      );
    } else {
      return (
        <Layout className={className}>
          <Layout>
            <Layout.Content>
              <button className="skip-main" onClick={this.handleSkipToMainContentClick} type="button">Skip to main content</button>
              {header}
              <div id="main-content" tabIndex={-1}>{renderRoutes(routes, {previewMode: previewShowing, questionToPreview: questionToPreview})}</div>
            </Layout.Content>
          </Layout>
        </Layout>
      );
    }
  }
};
