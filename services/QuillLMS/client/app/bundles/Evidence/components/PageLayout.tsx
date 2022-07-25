import * as React from "react";
import {renderRoutes} from "react-router-config";
import { useQuery } from 'react-query';

import Header from "./Header";

import { getUrlParam } from '../helpers/containerActionHelpers';
import { fetchUserIdsForSession } from '../../Shared/utils/userAPIs';
import { routes } from "../routes";
import { ScreenreaderInstructions, } from '../../Shared/index'

const PageLayout: React.StatelessComponent<{}> = (props: any) => {
  const { location, user, isTurk } = props;
  const sessionFromUrl = getUrlParam('session', location, isTurk)

  const { data: idData } = useQuery({
    queryKey: [`session-user-ids-${sessionFromUrl}`, sessionFromUrl],
    queryFn: fetchUserIdsForSession
  });

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
      <Header idData={idData} />
      <div id="main-content" tabIndex={-1}>{renderRoutes(routes, { user, idData })}</div>
    </div>
  );
};

export default PageLayout;
