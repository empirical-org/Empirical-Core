import * as React from 'react';

const arrow = `${process.env.CDN_URL}/images/icons/arrow-back.svg`;

export const ReturnButton = ({ history }) => {
  function handleClick() {
    history.push('/');
  }
  return(
    <button className="button-container interactive-wrapper focus-on-light" onClick={handleClick}>
      <img alt="left pointing arrow" src={arrow} />
      <p>All lockers</p>
    </button>
  );
}

export default ReturnButton;
