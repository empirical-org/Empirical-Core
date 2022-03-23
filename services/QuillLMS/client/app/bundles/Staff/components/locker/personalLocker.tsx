import * as React from 'react';

import ReturnButton from './returnButton';

export const PersonalLocker = ({ history }) => {
  return(
    <div>
      <ReturnButton history={history} />
    </div>
  );
}

export default PersonalLocker;
