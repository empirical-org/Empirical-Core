import * as React from "react";

export const TeamLocker = ({ lockerContents }) => {
  const { label, route, emoji, emojiLabel } = lockerContents;
  function handleClick() {
    console.log('clicked')
  }
  return(
    <button className="locker-container interactive-wrapper focus-on-light" onClick={handleClick}>
      <span role="img" aria-label={emojiLabel}>{emoji}</span>
      <p className="locker-label">{label}</p>
    </button>
  )
}

export default TeamLocker;
