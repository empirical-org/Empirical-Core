import * as React from "react";
import { withRouter } from 'react-router-dom';

import Locker from './locker';

import { lockerItems } from "../../helpers/locker/lockerItems";
import { titleCase } from "../../../Shared";

const arrow = `${process.env.CDN_URL}/images/icons/arrow-back.svg`;

export const TeamLocker = ({ match, history }) => {
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

  function handleClick() {
    history.push('/locker');
  }

  return(
    <div className="team-locker-container locker-content">
      <button className="button-container interactive-wrapper focus-on-light" onClick={handleClick}>
        <img alt="left pointing arrow" src={arrow} />
        <p>All lockers</p>
      </button>
      {renderHeader()}
      {renderTeamLockersSection()}
    </div>
  );
}

export default withRouter(TeamLocker);
