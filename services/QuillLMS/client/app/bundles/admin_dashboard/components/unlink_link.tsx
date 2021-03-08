import { truncate, truncateSync } from 'fs';
import * as React from 'react';
import { requestPost } from '../../../modules/request/index.js';

const unlink = (id) => {
  return requestPost(`/teachers/unlink/${id}`, null, () => {
    alert("unlinked")
  })
}

const UnlinkLink = ({ id }) => {
  return <a onClick={() => unlink(id)}>Unlink From School</a>
}

export default UnlinkLink;
