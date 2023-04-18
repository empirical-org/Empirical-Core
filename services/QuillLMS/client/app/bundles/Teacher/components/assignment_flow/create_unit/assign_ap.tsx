import React from 'react';

import ApContainer from '../../../containers/ApContainer';
import AssignmentFlowNavigation from '../assignment_flow_navigation';

const AssignAp = () => {
  return (
    <div>
      <AssignmentFlowNavigation />
      <ApContainer isPartOfAssignmentFlow={true} />
    </div>
  )
}

export default AssignAp
