import React from 'react';

import PreApContainer from '../../../containers/PreApContainer';
import AssignmentFlowNavigation from '../assignment_flow_navigation';

const AssignPreAp = () => {
  return (
    <div>
      <AssignmentFlowNavigation />
      <PreApContainer isPartOfAssignmentFlow={true} />
    </div>
  )
}

export default AssignPreAp
