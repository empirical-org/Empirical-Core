import React from 'react';

import AssignmentFlowNavigation from '../assignment_flow_navigation'
import PreApContainer from '../../../containers/PreApContainer'

const AssignPreAp = () => {
  return (
    <div>
      <AssignmentFlowNavigation />
      <PreApContainer isPartOfAssignmentFlow={true} />
    </div>
  )
}

export default AssignPreAp
