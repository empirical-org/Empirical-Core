import * as React from 'react';
import moment from 'moment';

import { getColumnWidth, } from '../../shared/getColumnWidth'
import { ReactTable, } from '../../../../Shared'

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

function columns(levelNumber, selectTopic, showExtraColumns, data) {
  const levelNumberColumnHeader = `Level ${levelNumber}`
  const levelNumberColumnWidth = getColumnWidth('name', levelNumberColumnHeader, data)
  let sharedColumns = [
    {
      Header: levelNumberColumnHeader,
      accessor: 'name',
      key: 'name',
      Cell: ({row}) => (<button className="interactive-wrapper" onClick={() => selectTopic(row.original)}>{row.original.name}</button>),
      sortType:  (a, b) => (a.original.name.localeCompare(b.original.name)),
      minWidth: levelNumberColumnWidth
    }
  ]

  if (showExtraColumns) {
    sharedColumns = sharedColumns.concat([
      {
        Header: 'Activities',
        accessor: 'activity_count',
        key: 'activities',
        sortType:  (a, b) => (a.original.activity_count - b.original.activity_count),
        maxWidth: 120
      }
    ])
  }

  if (showExtraColumns && levelNumber === 0) {
    const createdAtColumn = {
      Header: 'Created At',
      accessor: 'created_at',
      key: 'created_at',
      Cell: ({row}) => moment(row.original.created_at).format('M/D/YY'),
      sortType:  (a, b) => (new Date(a.original.created_at) - new Date(b.original.created_at)),
    }
    sharedColumns = sharedColumns.concat([createdAtColumn])
  }

  return sharedColumns
}

const TopicLevelTable: React.SFC<TopicLevelTableProps> = ({ topics, selectTopic, levelNumber, showExtraColumns }) => {
  const data = topics.filter(t => t.level === levelNumber);
  return (
    <ReactTable
      className="topics-table"
      columns={columns(levelNumber, selectTopic, showExtraColumns, data)}
      data={data}
    />
  );
};

export default TopicLevelTable;
