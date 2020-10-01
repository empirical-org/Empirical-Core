import * as React from "react";
import { Layout } from "antd";
import {renderRoutes} from "react-router-config";

import { Header } from "./Header";

import { routes } from "../routes";
import getParameterByName from '../helpers/getParameterByName';
import { TeacherPreviewMenu } from '../../Shared/index';

interface PageLayoutState {
  showFocusState: boolean;
  previewShowing: boolean;
  questionToPreview: any;
  switchedBackToPreview: boolean;
  randomizedQuestions: any[];
  skippedToQuestionFromIntro: boolean;
}

export class PageLayout extends React.Component<any, PageLayoutState> {
  constructor(props: any) {
    super(props);

    const studentSession = getParameterByName('student', window.location.href);
    const proofreaderSessionId = getParameterByName('proofreaderSessionId', window.location.href);

    this.state = {
      showFocusState: false,
      previewShowing: !studentSession && !proofreaderSessionId,
      questionToPreview: null,
      switchedBackToPreview: false,
      randomizedQuestions: null,
      skippedToQuestionFromIntro: false
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
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

  handleUpdateRandomizedQuestions = (questions: any[]) => {
    this.setState({ randomizedQuestions: questions });
  }

  handleSkipToQuestionFromIntro = () => {
    this.setState({ skippedToQuestionFromIntro: true });
  }

  renderContent = (header: JSX.Element, previewMode: boolean) => {
    const { questionToPreview, switchedBackToPreview, randomizedQuestions, skippedToQuestionFromIntro } = this.state;
    return(
      <Layout.Content>
        <button className="skip-main" onClick={this.handleSkipToMainContentClick} type="button">Skip to main content</button>
        {header}
        <div id="main-content" tabIndex={-1}>{renderRoutes(routes, {
          switchedBackToPreview: switchedBackToPreview,
          handleToggleQuestion: this.handleToggleQuestion,
          previewMode: previewMode,
          questionToPreview: questionToPreview,
          randomizedQuestions: randomizedQuestions,
          skippedToQuestionFromIntro: skippedToQuestionFromIntro
        })}</div>
      </Layout.Content>
    );
  }

  render() {
    const { showFocusState, previewShowing, questionToPreview } = this.state;
    const studentSession = getParameterByName('student', window.location.href);
    const proofreaderSession = getParameterByName('proofreaderSessionId', window.location.href);
    const turkSession = window.location.href.includes('turk')
    const studentOrTurkOrProofreader = studentSession || turkSession || proofreaderSession;
    const isPlaying = window.location.href.includes('play');
    const showPreview = previewShowing && isPlaying && !studentOrTurkOrProofreader;
    const previewMode = isPlaying && !studentOrTurkOrProofreader;
    let className = "ant-layout ";
    className = showFocusState ? '' : 'hide-focus-outline';
    let header;
    if(isPlaying && !studentSession) {
      header = <Header isTeacher={!studentOrTurkOrProofreader} onTogglePreview={this.handleTogglePreviewMenu} previewShowing={previewShowing} />;
    } else if(isPlaying) {
      header = <Header />;
    }
    return(
      <Layout className={className}>
        <Layout>
          {showPreview && <Layout.Sider
            breakpoint="md"
            className="sider-container"
            collapsedWidth="0"
            width={360}
          >
            <TeacherPreviewMenu
              onHandleSkipToQuestionFromIntro={this.handleSkipToQuestionFromIntro}
              onTogglePreview={this.handleTogglePreviewMenu}
              onToggleQuestion={this.handleToggleQuestion}
              onUpdateRandomizedQuestions={this.handleUpdateRandomizedQuestions}
              questionToPreview={questionToPreview}
              showPreview={previewShowing}
            />
          </Layout.Sider>}
          {this.renderContent(header, previewMode)}
        </Layout>
      </Layout>
    );
  }
};

export default PageLayout;
