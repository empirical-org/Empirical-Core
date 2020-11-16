import * as React from 'react';
import { Table } from 'antd';
import moment from 'moment';

interface TopicLevelTableProps {
  topics: Array<Topic>,
  levelNumber: number,
  selectTopic: Function,
  showExtraColumns: boolean
}

interface TopicRow {
  key: string;
  topicName:string;
  parentTopicName:string;
  grandparentTopicName:string;
  topicId:string;
  parentTopicId:string|null;
  grandparentTopicId:string|null;
  createdAt:number;
}

function columns(levelNumber, selectTopic, showExtraColumns) {
  let sharedColumns = [
    {
      title: `Level ${levelNumber}`,
      dataIndex: 'name',
      defaultSortOrder: 'ascend',
      key: 'name',
      render: (text, record:TopicRow) => (<div onClick={() => selectTopic(record)}>{text}</div>),
      sorter:  (a, b) => (a.name.localeCompare(b.name)),
    }
  ]

  if (showExtraColumns) {
    sharedColumns = sharedColumns.concat([
      {
        title: 'Activities',
        dataIndex: 'activity_count',
        key: 'activities',
        sorter:  (a, b) => (a.activity_count - b.activity_count),
      }
    ])
  }

  if (showExtraColumns && levelNumber === 0) {
    const createdAtColumn = {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => moment(text).format('M/D/YY'),
      sorter:  (a, b) => (a.created_at - b.created_at),
    }
    sharedColumns = sharedColumns.concat([createdAtColumn])
  }

  return sharedColumns
}

const TopicLevelTable: React.SFC<TopicLevelTableProps> = ({ topics, selectTopic, levelNumber, showExtraColumns }) => {
  const data = topics.filter(t => t.level === levelNumber);
  return (
    <Table
      bordered
      className="topics-table"
      columns={columns(levelNumber, selectTopic, showExtraColumns)}
      dataSource={data}
      pagination={false}
      size="middle"
    />
  );
};

export default TopicLevelTable;
