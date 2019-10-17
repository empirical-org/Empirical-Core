import * as React from 'react';
import _ from 'underscore';
import Unit from './unit';

const Units = ({ data, hideClassroomActivity, hideUnit, report, lesson, updateDueDate}) => {
  const units = data.map(data =>
    (<Unit
      key={data.unitId}
      hideClassroomActivity={hideClassroomActivity}
      hideUnit={hideUnit}
      report={report}
      lesson={lesson}
      updateDueDate={updateDueDate}
      data={data}
    />)
  );
  return <span>{units}</span>
}

export default Units
