import * as React from 'react';

import Unit from './unit';

const Units = ({ data, hideClassroomActivity, hideUnit, report, lesson, updateDueDate}) => {
  const units = data.map(data =>
    (<Unit
      data={data}
      hideClassroomActivity={hideClassroomActivity}
      hideUnit={hideUnit}
      key={data.unitId}
      lesson={lesson}
      report={report}
      updateDueDate={updateDueDate}
    />)
  );
  return <span>{units}</span>
}

export default Units
