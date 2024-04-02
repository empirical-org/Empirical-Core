import * as React from 'react';

import { requestGet } from '../../../modules/request';
import SpringBoard from '../components/college_board/spring_board';

interface SpringBoardContainerProps {
  isPartOfAssignmentFlow?: boolean;
  units?: Array<any>
}

interface SpringBoardContainerState {
  units: Array<any>
}

export const SpringBoardContainer = ({ isPartOfAssignmentFlow, units }: SpringBoardContainerProps) => {

  const [springBoardUnits, setSpringBoardUnits] = React.useState<SpringBoardContainerState>(units || []);

  React.useEffect(() => {
    setUnits();
  }, []);

  const setUnits = () => {
    if (!springBoardUnits.length) {
      requestGet('/springboard_units.json',
        (data) => {
          setSpringBoardUnits(data.units);
        }
      )
    }
  }
  return <SpringBoard isPartOfAssignmentFlow={isPartOfAssignmentFlow} units={springBoardUnits} />
}

export default SpringBoardContainer
