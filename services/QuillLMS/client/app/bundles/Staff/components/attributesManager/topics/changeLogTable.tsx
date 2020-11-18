import * as React from 'react';
import { Table } from 'antd';
import moment from 'moment';

import { ChangeLog } from '../../../interfaces/interfaces';

interface ChangeLogsTableProps {
  changeLogs: Array<ChangeLog>
}

interface ChangeLogRow {
  key: string;
  topic_name:string;
  action:string;
  explanation:string;
  authorName:string;
  created_at:number;
  changed_attribute:string;
  previous_value:string;
}

function columns() {
  return [
    {
      title: 'Topic Name',
      dataIndex: 'topic_name',
      key: 'topic_name',
      render: (text) => (<div>{text}</div>),
      sorter: ((a, b) => a.topic_name.localeCompare(b.topic_name))
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text) => (<div>{text}</div>),
      sorter: ((a, b) => a.action.localeCompare(b.action)),
      width: 120
    },
    {
      title: 'Explanation',
      dataIndex: 'explanation',
      key: 'explanation',
      render: (text) => (<div>{text}</div>),
      sorter: ((a, b) => a.explanation.localeCompare(b.explanation)),
      width: 250
    },
    {
      title: 'Changed Attribute',
      dataIndex: 'changed_attribute',
      key: 'changed_attribute',
      render: (text) => (<div>{text}</div>),
      sorter: ((a, b) => a.changed_attribute.localeCompare(b.changed_attribute)),
      width: 130
    },
    {
      title: 'Previous Value',
      dataIndex: 'previous_value',
      key: 'previous_value',
      render: (text) => (<div>{text}</div>),
      sorter: ((a, b) => a.previous_value.localeCompare(b.previous_value)),
    },
    {
      title: 'Author',
      dataIndex: 'authorName',
      key: 'authorName',
      render: (text) => (<div>{text}</div>),
      sorter: ((a, b) => a.authorName.localeCompare(b.authorName)),
    },
    {
      title: 'Timestamp',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (timestamp) => moment(timestamp).format('MMMM D, YYYY [at] LT'),
      sorter:  (a, b) => (new Date(a.created_at) - new Date(b.created_at)),
      defaultSortOrder: 'descend'
    },
  ];
}

function prepareData(data:Array<ChangeLog>):Array<ChangeLogRow> {
  return data.map((changeLog:ChangeLog) => prepareRow(changeLog))
}

function prepareRow(changeLog:ChangeLog):ChangeLogRow {
  return {
    key: changeLog.id,
    topic_name: changeLog.topic_name,
    action: changeLog.action,
    changed_attribute: changeLog.changed_attribute,
    previous_value: changeLog.previous_value,
    explanation: changeLog.explanation,
    authorName: changeLog.user.name,
    created_at: changeLog.created_at,
  }
}

const ChangeLogsTable: React.SFC<ChangeLogsTableProps> = ({changeLogs}) => {
  const data = prepareData(changeLogs)
  return (
    <Table
      bordered
      className="topics-table"
      columns={columns()}
      dataSource={data}
      pagination={false}
      size="middle"
    />
  );
};

export default ChangeLogsTable;
