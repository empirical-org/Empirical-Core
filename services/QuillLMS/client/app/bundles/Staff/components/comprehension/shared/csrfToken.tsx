import React from 'react';
import { getCookie } from '../../../../../helpers/comprehension';

const csrftoken = getCookie('csrftoken');

const CSRFToken = () => {
  return (
    <input aria-label="csrf" name="csrfmiddlewaretoken" type="hidden" value={csrftoken} />
  );
};
export default CSRFToken;
