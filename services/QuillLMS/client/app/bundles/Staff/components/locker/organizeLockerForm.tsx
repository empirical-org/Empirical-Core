import * as React from 'react';

import ReturnButton from './returnButton';

export const OrganizeLockerForm = ({ history, personalLocker }) => {
  return(
    <div className="locker-content organize-locker-form-container">
      <ReturnButton backLink="/personal-locker" buttonLabel="Personal locker" history={history} />
      <h4>Organize your locker</h4>
    </div>
  )
}

export default OrganizeLockerForm;
