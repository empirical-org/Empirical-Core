import * as React from 'react';
import { requestPost } from '../../../modules/request/index';

const unlink = (id, refreshData) => {
  return requestPost(`/teachers/unlink/${id}`, null, () => {
    refreshData()
  })
}

const UnlinkLink = ({ id, refreshData }) => {
  let linkClass = 'teacher-link';
  return <a className={linkClass} onClick={() => unlink(id, refreshData)}>Unlink From School</a>
}

export default UnlinkLink;
