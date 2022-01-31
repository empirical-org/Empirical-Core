import React from 'react';

import AssignmentFlowNavigation from '../assignment_flow_navigation'
import ApContainer from '../../../containers/ApContainer'

const AssignAp = () => {
  return (
    <div>
      <AssignmentFlowNavigation />
      <ApContainer isPartOfAssignmentFlow={true} />
    </div>
  )
}

export default AssignAp
