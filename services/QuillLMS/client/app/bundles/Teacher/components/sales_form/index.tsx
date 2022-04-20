import * as React from 'react';

import { titleCase } from '../../../Shared';

export const SalesForm = ({ type }) => {
  return(
    <div>
      <h3>{`${titleCase(type)} form`}</h3>
    </div>
  )
}

export default SalesForm
