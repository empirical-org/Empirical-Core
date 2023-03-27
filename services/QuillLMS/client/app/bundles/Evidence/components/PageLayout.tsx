import * as React from "react";
import { renderRoutes } from "react-router-config";

import Header from "./Header";

import { ScreenreaderInstructions } from '../../Shared/index';
import { routes } from "../routes";

const PageLayout: React.StatelessComponent<{}> = (props: any) => {
  const { user } = props;

  function handleSkipToMainContentClick () {
    const element = document.getElementById("main-content")
    if (!element) { return }
    element.focus()
    element.scrollIntoView()
  }

  return (
    <div className="app-container">
      <ScreenreaderInstructions />
      <button className="skip-main" onClick={handleSkipToMainContentClick} type="button">Skip to main content</button>
      <Header />
      <div id="main-content" tabIndex={-1}>{renderRoutes(routes, { user })}</div>
    </div>
  );
};

export default PageLayout;
