import * as React from "react";
import { Link } from 'react-router-dom';

import { lockerItems } from "../../helpers/locker/lockerItems";
import { titleCase } from "../../../Shared";

const arrow = `${process.env.CDN_URL}/images/icons/arrow-back.svg`;

export const TeamLocker = ({ match }) => {
  const { params } = match;
  const { team } = params;
  const lockerContents = lockerItems[team];
  const { label } = lockerContents;

  return(
    <div className="team-locker-container locker-content">
      <Link className="back-nav-link" tabIndex={-1} to="/locker">
        <button className="button-container interactive-wrapper focus-on-light">
          <img src={arrow}/>
          <p>All Lockers</p>
        </button>
      </Link>
      <h3 className="subheader">{`${titleCase(label)} lockers`}</h3>
    </div>
  );
}

export default TeamLocker;
