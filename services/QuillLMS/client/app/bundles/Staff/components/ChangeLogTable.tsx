import * as React from 'react';
import { Table } from 'antd';
import { firstBy } from "thenby";
import moment from 'moment';

import { ChangeLog } from '../interfaces/interfaces';

interface ChangeLogsTableProps {
  changeLogs: Array<ChangeLog>
}

interface ChangeLogRow {
  key: string;
  conceptName:string;
  conceptUID:string;
  action:string;
  explanation:string;
  authorName:string;
  createdAt:number;
  changedAttribute:string;
  previousValue:string;
}

function columns() {
  return [
    {
      title: 'Concept Name',
      dataIndex: 'conceptName',
      key: 'conceptName',
      render: (text) => (<div>{text}</div>),
      sorter: ((a, b) => a.conceptName.localeCompare(b.conceptName))
    },
    {
      title: 'UID',
      dataIndex: 'conceptUID',
      key: 'conceptUID',
      render: (text) => (<div>{text}</div>),
      sorter: ((a, b) => a.conceptUID.localeCompare(b.conceptUID)),
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
      dataIndex: 'changedAttribute',
      key: 'changedAttribute',
      render: (text) => (<div>{text}</div>),
      sorter: ((a, b) => a.changedAttribute.localeCompare(b.changedAttribute)),
      width: 130
    },
    {
      title: 'Previous Value',
      dataIndex: 'previousValue',
      key: 'previousValue',
      render: (text) => (<div>{text}</div>),
      sorter: ((a, b) => a.previousValue.localeCompare(b.previousValue)),
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
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (timestamp) => moment.unix(timestamp).format('MMMM D, YYYY [at] LT'),
      sorter:  (a, b) => (a.createdAt - b.createdAt),
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
    conceptName: changeLog.concept.name,
    conceptUID: changeLog.concept.uid,
    action: changeLog.action,
    changedAttribute: changeLog.changedAttribute,
    previousValue: changeLog.previousValue,
    explanation: changeLog.explanation,
    authorName: changeLog.user.name,
    createdAt: changeLog.createdAt,
  }
}

const ChangeLogsTable: React.SFC<ChangeLogsTableProps> = ({changeLogs}) => {
  const data = prepareData(changeLogs)
  return (
    <Table
      bordered
      className="concepts-table"
      columns={columns()}
      dataSource={data}
      pagination={false}
      size="middle"
    />
  );
};

export default ChangeLogsTable;
