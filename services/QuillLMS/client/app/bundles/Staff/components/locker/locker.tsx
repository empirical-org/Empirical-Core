import * as React from "react";
import { useHistory } from 'react-router-dom';

import { titleCase } from "../../../Shared";

export const TeamLocker = ({ lockerContents }) => {
  const history = useHistory();
  const { label, route, href, emoji, emojiLabel } = lockerContents;

  function handleClick() {
    if(route) {
      history.push(`/${route}`)
    } else {
      window.location.href = `${process.env.DEFAULT_URL}${href}`
    }
  }

  return(
    <button className="locker-container interactive-wrapper focus-on-light" onClick={handleClick}>
      <span role="img" aria-label={emojiLabel}>{emoji}</span>
      <p className="locker-label">{titleCase(label)}</p>
    </button>
  )
}

export default TeamLocker;
