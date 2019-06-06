import * as React from 'react';
import { Table } from 'antd';
import { firstBy } from "thenby";

import { ChangeLog } from '../interfaces/interfaces';
import moment from 'moment';

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
}

function columns() {
  return [
    {
      title: 'Concept Name',
      dataIndex: 'conceptName',
      key: 'conceptName',
      render: (text) => (<div>{text}</div>),
      sorter: firstBy('conceptName'),
    },
    {
      title: 'UID',
      dataIndex: 'conceptUID',
      key: 'conceptUID',
      render: (text) => (<div>{text}</div>),
      sorter: firstBy('conceptUID'),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text) => (<div>{text}</div>),
      sorter: firstBy('action'),
    },
    {
      title: 'Explanation',
      dataIndex: 'explanation',
      key: 'explanation',
      render: (text) => (<div>{text}</div>),
      sorter: firstBy('explanation'),
      width: 300
    },
    {
      title: 'Author',
      dataIndex: 'authorName',
      key: 'authorName',
      render: (text) => (<div>{text}</div>),
      sorter: firstBy('authorName'),
    },
    {
      title: 'Timestamp',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (timestamp) => moment.unix(timestamp).format('MMMM D, YYYY [at] LT'),
      sorter:  (a, b) => (a.createdAt - b.createdAt),
    },
  ];
}

function prepareData(data:Array<ChangeLog>):Array<ChangeLogRow> {
  return data.map((changeLog:ChangeLog) => prepareRow(changeLog));
}

function prepareRow(changeLog:ChangeLog):ChangeLogRow {
  return {
    key: changeLog.id,
    conceptName: changeLog.concept.name,
    conceptUID: changeLog.concept.uid,
    action: changeLog.action,
    explanation: changeLog.explanation,
    authorName: changeLog.user.name,
    createdAt: changeLog.createdAt,
  }
}

const ChangeLogsTable: React.SFC<ChangeLogsTableProps> = ({changeLogs}) => {
  const data = prepareData(changeLogs)
  return (
    <Table
      columns={columns()}
      dataSource={data}
      size="middle"
      bordered
      pagination={false}
      className="concepts-table"
    />
  );
};

export default ChangeLogsTable;
