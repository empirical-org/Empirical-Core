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
  questionToPreview: any;
  switchedBackToPreview: boolean;
  randomizedQuestions: any[];
}

export class PageLayout extends React.Component<any, PageLayoutState> {
  constructor(props: any) {
    super(props)

    this.state = { 
      showFocusState: false,
      previewShowing: false,
      questionToPreview: null,
      switchedBackToPreview: false,
      randomizedQuestions: null
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    this.handleMenuShowState();

  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  handleMenuShowState = () => {
    const studentSession = getParameterByName('student', window.location.href);
    if(!studentSession) {
      this.setState({ previewShowing: true });
    }
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

  handleUpdateRandomizedQuestions = (questions: any[]) => {
    this.setState({ randomizedQuestions: questions });
  }

  render() {
    const { showFocusState, previewShowing, questionToPreview, switchedBackToPreview, randomizedQuestions } = this.state;
    const studentSession = getParameterByName('student', window.location.href);
    const isPlaying = window.location.href.includes('play');
    const showPreview = previewShowing && isPlaying;
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
            <Layout.Sider 
              breakpoint="md"
              className="sider-container" 
              collapsedWidth="0"
              width={360}
            >
              <TeacherPreviewMenu
                onTogglePreview={this.handleTogglePreviewMenu}
                onToggleQuestion={this.handleToggleQuestion} 
                onUpdateRandomizedQuestions={this.handleUpdateRandomizedQuestions} 
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
                questionToPreview: questionToPreview,
                randomizedQuestions: randomizedQuestions
              })}</div>
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
              <div id="main-content" tabIndex={-1}>{renderRoutes(routes, {previewMode: previewShowing})}</div>
            </Layout.Content>
          </Layout>
        </Layout>
      );
    }
  }
};

export default PageLayout;
