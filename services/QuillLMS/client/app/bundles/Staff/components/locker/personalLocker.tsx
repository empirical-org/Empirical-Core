import * as React from 'react';

import ReturnButton from './returnButton';

export const PersonalLocker = ({ history, personalLocker }) => {

  function navigateToOrganizeForm() {
    history.push('/personal-locker/organize');
  }

  return(
    <div className="locker-content personal-locker-container">
      <div className="buttons-container">
        <ReturnButton backLink="/" buttonLabel="All lockers" history={history} />
        <button className="button-container interactive-wrapper focus-on-light organize-button" onClick={navigateToOrganizeForm}>
          <p>⚙️</p>
          <p>Organize Locker</p>
        </button>
      </div>
    </div>
  );
}

export default PersonalLocker;
