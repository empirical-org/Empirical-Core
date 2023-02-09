import * as React from 'react';

const arrow = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/arrow-back.svg`;

export const ReturnButton = ({ history, buttonLabel, backLink }) => {
  function handleClick() {
    history.push(backLink);
  }
  return(
    <button className="button-container interactive-wrapper focus-on-light" onClick={handleClick}>
      <img alt="left pointing arrow" src={arrow} />
      <p>{buttonLabel}</p>
    </button>
  );
}

export default ReturnButton;
