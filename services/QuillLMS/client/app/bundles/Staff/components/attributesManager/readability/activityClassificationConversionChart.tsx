import * as React from 'react';

import { ReactTable } from '../../../../Shared/index';

const columns = [
  {
    Header: 'Raw Score',
    accessor: 'raw_score',
    key: 'raw_score',
    width: 100
  },
  {
    Header: 'Grade Band',
    accessor: 'grade_band',
    key: 'grade_band',
    width: 100
  },
  {
    Header: 'Activities',
    accessor: 'activity_count',
    key: 'activity_count',
    width: 100
  },
]

const ActivityClassificationConversionChart = ({ classificationName, conversionChart}) => {
  return (
    <div className="activity-classification-conversion-chart">
      <h2>{classificationName}</h2>
      <ReactTable
        className="activity-classification-conversion-chart-table"
        columns={columns}
        data={conversionChart}
        defaultPageSize={conversionChart.length}
      />
    </div>
  );
}

export default ActivityClassificationConversionChart
