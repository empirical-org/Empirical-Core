import * as React from 'react';

import SpringBoard from '../components/college_board/spring_board';

interface SpringBoardProps {
  isPartOfAssignmentFlow?: boolean;
}

export const SpringBoardContainer = ({ isPartOfAssignmentFlow }: SpringBoardProps) => {
  return <SpringBoard isPartOfAssignmentFlow={isPartOfAssignmentFlow} />
}

export default SpringBoardContainer;
