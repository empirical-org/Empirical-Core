import * as React from 'react';

import ReturnButton from './returnButton';

import { renderLockerSections } from '../../helpers/locker/lockerHelperFunctions';

export const PersonalLocker = ({ history, personalLocker }) => {

  function navigateToOrganizeForm() {
    history.push('/personal-locker/organize');
  }

  const shouldRenderLockerSections = personalLocker && personalLocker.preferences;

  return(
    <div className="locker-content personal-locker-container">
      <div className="buttons-container">
        <ReturnButton backLink="/" buttonLabel="All lockers" history={history} />
        <button className="button-container interactive-wrapper focus-on-light organize-button" onClick={navigateToOrganizeForm}>
          <p>⚙️</p>
          <p>Organize Locker</p>
        </button>
      </div>
      {shouldRenderLockerSections && renderLockerSections(personalLocker.preferences, 'personal')}
    </div>
  );
}

export default PersonalLocker;
