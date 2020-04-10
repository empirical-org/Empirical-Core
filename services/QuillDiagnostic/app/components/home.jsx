import React from 'react';
import StudentNavBar from './navbar/studentNavbar';
import { Layout } from "antd";
import { renderRoutes } from "react-router-config";
import { routes } from "../routes";
import { Spinner } from 'quill-component-library/dist/componentLibrary'

export default class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = { showFocusState: false }
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

  render() {
    const { showFocusState, } = this.state
    let className = "ant-layout "
    className = showFocusState ? '' : 'hide-focus-outline'
    const studentPlaying = !!window.location.href.includes('play');
    return(
      <Layout className={className}>
        <Layout>
          <Layout.Content>
            {studentPlaying && <button className="skip-main" onClick={this.handleSkipToMainContentClick} type="button">Skip to main content</button>}
            {studentPlaying && <StudentNavBar />}
            <div id="main-content" tabIndex={-1}>{renderRoutes(routes)}</div>
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
};