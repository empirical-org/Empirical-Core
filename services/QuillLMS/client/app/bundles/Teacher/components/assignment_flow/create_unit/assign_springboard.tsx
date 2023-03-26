import React from 'react';

import SpringBoardContainer from '../../../containers/SpringBoardContainer';
import AssignmentFlowNavigation from '../assignment_flow_navigation';

const AssignSpringBoard = () => {
  return (
    <div>
      <AssignmentFlowNavigation />
      <SpringBoardContainer isPartOfAssignmentFlow={true} />
    </div>
  )
}

export default AssignSpringBoard
