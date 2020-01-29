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

  render() {
    const { showFocusState, } = this.state
    let className = "ant-layout "
    className = showFocusState ? '' : 'hide-focus-outline'
    const header = window.location.href.includes('play') ? <Header /> : null
    return (
      <Layout className={className}>
        <Layout>
          <Layout.Content>
            {header}
            {renderRoutes(routes)}
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
};
