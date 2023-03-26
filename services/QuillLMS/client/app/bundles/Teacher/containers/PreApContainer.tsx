import * as React from 'react';
import { requestGet } from '../../../modules/request';
import PreAp from '../components/college_board/pre_ap';

interface PreApContainerProps {
  isPartOfAssignmentFlow?: boolean;
  units?: Array<any>
}

interface PreApContainerState {
  units: Array<any>
}

export const PreApContainer = ({ isPartOfAssignmentFlow, units }: PreApContainerProps) => {

  const [preApUnits, setPreApUnits] = React.useState<PreApContainerState>(units || []);

  React.useEffect(() => {
    setUnits();
  }, []);

  const setUnits = () => {
    if (!preApUnits.length) {
      requestGet('/preap_units.json',
        (data) => {
          setPreApUnits(data.units);
        }
      )
    }
  }
  return <PreAp isPartOfAssignmentFlow={isPartOfAssignmentFlow} units={preApUnits} />
}

export default PreApContainer
