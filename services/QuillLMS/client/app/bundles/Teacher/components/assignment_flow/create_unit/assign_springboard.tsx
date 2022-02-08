import React from 'react';

import AssignmentFlowNavigation from '../assignment_flow_navigation'
import SpringBoardContainer from '../../../containers/SpringBoardContainer'

const AssignSpringBoard = () => {
  return (
    <div>
      <AssignmentFlowNavigation />
      <SpringBoardContainer isPartOfAssignmentFlow={true} />
    </div>
  )
}

export default AssignSpringBoard
