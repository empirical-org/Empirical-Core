import * as React from "react";
import { withRouter } from 'react-router-dom';

import ReturnButton from "./returnButton";

import { lockerItems } from "../../helpers/locker/lockerItems";
import { renderLockerSections } from "../../helpers/locker/lockerHelperFunctions";
import { titleCase } from "../../../Shared";

export const TeamLocker = ({ match, history }) => {
  const { params } = match;
  const { team } = params;
  const lockerContents = lockerItems[team];
  const { label, lockers } = lockerContents;

  function renderHeader() {
    if(label === 'all lockers') { return <h3 className="subheader">Index</h3>}
    return <h3 className="subheader">{`${titleCase(label)} lockers`}</h3>
  }

  return(
    <div className="team-locker-container locker-content">
      <ReturnButton backLink="/" buttonLabel="All lockers" history={history} />
      {renderHeader()}
      {renderLockerSections(lockers, 'team')}
    </div>
  );
}

export default withRouter(TeamLocker);
