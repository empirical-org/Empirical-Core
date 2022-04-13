import * as React from 'react';

import ReturnButton from './returnButton';
import Locker from './locker';

import { titleCase } from '../../../Shared';

export const PersonalLocker = ({ history, personalLocker }) => {

  function navigateToOrganizeForm() {
    history.push('/personal-locker/organize');
  }

  function renderLockersForPersonalLocker() {
    const { label, preferences } = personalLocker
    return(
      <div className="locker-contents">
        <h3>{label}</h3>
        {Object.keys(preferences).map(sectionKey => {
          const { label, lockers } = preferences[sectionKey];
          return(
            <div className="locker-section-container" key={sectionKey}>
              <h4>{label}</h4>
              <div className='personal-lockers-container'>
                {Object.keys(lockers).map(lockerKey => {
                  return <Locker key={lockerKey} lockerContents={lockers[lockerKey]} />
                })}
              </div>
            </div>
            );
          })
        }
      </div>
    )
  }

  const label = personalLocker && personalLocker.user_id ? 'Organize locker' : 'Create locker';

  return(
    <div className="locker-content personal-locker-container">
      <div className="buttons-container">
        <ReturnButton backLink="/" buttonLabel="All lockers" history={history} />
        <button className="button-container interactive-wrapper focus-on-light organize-button" onClick={navigateToOrganizeForm}>
          <p>⚙️</p>
          <p>{label}</p>
        </button>
      </div>
      {personalLocker && renderLockersForPersonalLocker()}
    </div>
  );
}

export default PersonalLocker;
