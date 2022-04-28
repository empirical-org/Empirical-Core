import * as React from "react";
import Header from "./Header";
import {renderRoutes} from "react-router-config";
import { routes } from "../routes";

import { ScreenreaderInstructions, } from '../../Shared/index'

export default class PageLayout extends React.Component<any, { showFocusState: boolean }> {
  constructor(props: any) {
    super(props)

    this.state = { showFocusState: false }
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

  handleSkipToPassageButtonsClick = () => {
    const element = document.getElementById("button-container")
    if (!element) { return }
    element.focus()
    element.scrollIntoView(false)
  }

  render() {
    const { showFocusState, } = this.state
    let className = "ant-layout activity-container "
    className += showFocusState ? '' : 'hide-focus-outline'
    const header = window.location.href.includes('play') ? <Header /> : null
    return (
      <div className={className}>
        <div className="page-content">
          <ScreenreaderInstructions />
          <button className="skip-main" onClick={this.handleSkipToMainContentClick} type="button">Skip to main content</button>
          <button className="skip-main" onClick={this.handleSkipToPassageButtonsClick} type="button">Skip to passage buttons</button>
          {header}
          <div id="main-content" tabIndex={-1}>{renderRoutes(routes)}</div>
        </div>
      </div>
    );
  }
};
