import * as React from "react";
import { useHistory } from 'react-router-dom';

import { titleCase, informationIcon, Tooltip } from "../../../Shared";

export const TeamLocker = ({ lockerContents }) => {
  const history = useHistory();
  const { label, route, href, emoji, emojiLabel, tooltipInfo, overrideTitleCase } = lockerContents;

  function handleClick() {
    if(route) {
      history.push(`/${route}`)
    } else {
      window.open(href, '_blank').focus();
    }
  }

  function renderLabel() {
    if(overrideTitleCase) { return label };
    return titleCase(label);
  }

  function renderTooltip() {
    const hideTooltip = tooltipInfo ? '' : 'hide-tooltip';
    return(
      <div className={`tooltip-container ${hideTooltip}`}>
        <Tooltip
          tooltipText={tooltipInfo}
          tooltipTriggerText={<img alt={informationIcon.alt} className="information-icon" src={informationIcon.src} />}
        />
      </div>
    )
  }

  return(
    <button className="locker-container interactive-wrapper focus-on-light" onClick={handleClick}>
      <div className="left-side-contents">
        <span className="emoji-image" role="img" aria-label={emojiLabel}>{emoji}</span>
        <p className="locker-label">{renderLabel()}</p>
      </div>
      {renderTooltip()}
    </button>
  )
}

export default TeamLocker;
