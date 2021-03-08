import { truncate, truncateSync } from 'fs';
import * as React from 'react';
import { requestPost } from '../../../modules/request/index.js';

const unlink = (id, refreshData) => {
  return requestPost(`/teachers/unlink/${id}`, null, () => {
    refreshData();
  })
}

const UnlinkLink = ({ id, refreshData }) => {
  return <a onClick={() => unlink(id, refreshData)}>Unlink From School</a>
}

export default UnlinkLink;
