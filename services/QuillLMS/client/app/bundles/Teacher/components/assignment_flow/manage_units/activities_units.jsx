import React from 'react';
import _ from 'underscore';

import Unit from './activities_unit';

const ActivitiesUnits = props => {
  const units = _.map(props.data, function (data) {
    return (
      <Unit
        activityReport={props.activityReport}
        activityWithRecommendationsIds={props.activityWithRecommendationsIds}
        allowSorting={props.allowSorting}
        data={data}
        hideUnit={props.hideUnit}
        hideUnitActivity={props.hideUnitActivity}
        key={data.unitId}
        lesson={props.lesson}
        report={props.report}
        updateDueDate={props.updateDueDate}
        updateMultipleDueDates={props.updateMultipleDueDates}
      />
    );
  }, this);
  return (
    <span>{units}</span>
  );
};

export default ActivitiesUnits;
