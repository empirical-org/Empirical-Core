import * as React from 'react';
import Ap from '../components/college_board/ap';

interface ApContainerProps {
  isPartOfAssignmentFlow?: boolean;
}

const ApContainer = ({ isPartOfAssignmentFlow, }): ApContainerProps => <Ap isPartOfAssignmentFlow={isPartOfAssignmentFlow} />

export default ApContainer
