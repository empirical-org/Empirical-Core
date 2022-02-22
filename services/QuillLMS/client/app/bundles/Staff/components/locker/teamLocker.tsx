import * as React from "react";
import { Link, withRouter } from 'react-router-dom';

import Locker from './locker';

import { lockerItems } from "../../helpers/locker/lockerItems";
import { titleCase } from "../../../Shared";
import { renderHeader } from "../../helpers/evidence/renderHelpers";

const arrow = `${process.env.CDN_URL}/images/icons/arrow-back.svg`;

export const TeamLocker = ({ match }) => {
  const { params } = match;
  const { team } = params;
  const lockerContents = lockerItems[team];
  const { label, lockers } = lockerContents;

  function renderTeamLockersSection() {
    return Object.keys(lockers).map(lockerSection => {
      return(
        <div className="locker-section-container" key={lockerSection}>
          <h4>{titleCase(lockerSection)}</h4>
          <div className="lockers-container">
            {renderLockerSection(lockerSection)}
          </div>
        </div>
      );
    });
  }

  function renderLockerSection(lockerSection: string) {
    const lockersForSection = lockers[lockerSection];
    return lockersForSection.map((lockerForSection: string) => {
      const lockerContents = lockerItems[lockerForSection];
      return <Locker key={lockerForSection} lockerContents={lockerContents} />
    });
  }

  function renderHeader() {
    if(label === 'all lockers') { return <h3 className="subheader">Index</h3>}
    return <h3 className="subheader">{`${titleCase(label)} lockers`}</h3>
  }

  return(
    <div className="team-locker-container locker-content">
      <Link className="back-nav-link" tabIndex={-1} to="/locker">
        <button className="button-container interactive-wrapper focus-on-light">
          <img src={arrow}/>
          <p>All Lockers</p>
        </button>
      </Link>
      {renderHeader()}
      {renderTeamLockersSection()}
    </div>
  );
}

export default withRouter(TeamLocker);
