import React from 'react';
import Dashboard from '../containers/dashboard.jsx';
import { ANONYMOUS_ASSIGN_UNIT_TEMPLATE_ID } from '../components/assignment_flow/localStorageKeyConstants'

export default props => {
  const unitTemplateId = window.localStorage.getItem(ANONYMOUS_ASSIGN_UNIT_TEMPLATE_ID)
  if (unitTemplateId) {
    window.location.href = `/assign/featured-activity-packs/${unitTemplateId}`
    return <span />
  }
  return <Dashboard {...props} />
}
