import * as React from 'react'
import { Table } from 'antd';

const columns = [
  {
    title: 'Raw Score',
    dataIndex: 'raw_score',
    key: 'raw_score'
  },
  {
    title: 'Grade Band',
    dataIndex: 'grade_band',
    key: 'grade_band'
  },
  {
    title: 'Activities',
    dataIndex: 'activity_count',
    key: 'activity_count'
  },
]

const ActivityClassificationConversionChart = ({ classificationName, conversionChart}) => {
  return (
    <div className="activity-classification-conversion-chart">
      <h2>{classificationName}</h2>
      <Table
        bordered
        className="activity-classification-conversion-chart-table"
        columns={columns}
        dataSource={conversionChart}
        pagination={false}
        size="middle"
      />
    </div>
  );
}

export default ActivityClassificationConversionChart
