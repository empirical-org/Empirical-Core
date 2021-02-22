import * as React from 'react'
import ReactTable from 'react-table';

const columns = [
  {
    Header: 'Raw Score',
    accessor: 'raw_score',
    key: 'raw_score'
  },
  {
    Header: 'Grade Band',
    accessor: 'grade_band',
    key: 'grade_band'
  },
  {
    Header: 'Activities',
    accessor: 'activity_count',
    key: 'activity_count'
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
        showPagination={false}
      />
    </div>
  );
}

export default ActivityClassificationConversionChart
