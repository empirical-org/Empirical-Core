import * as React from 'react';

import SpringBoard from '../components/college_board/spring_board';

interface SpringBoardContainerProps {
  isPartOfAssignmentFlow?: boolean;
}

export const SpringBoardContainer = ({ isPartOfAssignmentFlow }: SpringBoardContainerProps) => {
  return <SpringBoard isPartOfAssignmentFlow={isPartOfAssignmentFlow} />
}

export default SpringBoardContainer
