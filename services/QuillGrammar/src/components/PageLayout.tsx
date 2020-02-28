import * as React from "react";
import { Layout } from "antd";
import { Header } from "./Header";
import {renderRoutes} from "react-router-config";
import { routes } from "../routes";

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

  render() {
    const { showFocusState, } = this.state
    let className = "ant-layout "
    className = showFocusState ? '' : 'hide-focus-outline'
    const header = window.location.href.includes('play') ? <Header /> : null
    return (
      <Layout className={className}>
        <Layout>
          <Layout.Content>
            <button className="skip-main" onClick={this.handleSkipToMainContentClick} type="button">Skip to main content</button>
            {header}
            <div id="main-content" tabIndex={-1}>{renderRoutes(routes)}</div>
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
};
