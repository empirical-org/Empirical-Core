import moment from 'moment';
import * as React from 'react';

import { ReactTable } from '../../../../Shared';
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
      Header: 'Topic Name',
      accessor: 'topic_name',
      key: 'topic_name',
      Cell: ({row}) => (<div>{row.original.topic_name}</div>),
      sortType: ((a, b) => a.original.topic_name.localeCompare(b.original.topic_name))
    },
    {
      Header: 'Action',
      accessor: 'action',
      key: 'action',
      Cell: ({row}) => (<div>{row.original.action}</div>),
      sortType: ((a, b) => a.original.action.localeCompare(b.original.action)),
      maxWidth: 120
    },
    {
      Header: 'Explanation',
      accessor: 'explanation',
      key: 'explanation',
      Cell: ({row}) => (<div>{row.original.explanation}</div>),
      sortType: ((a, b) => a.original.explanation.localeCompare(b.original.explanation)),
      maxWidth: 250
    },
    {
      Header: 'Changed Attribute',
      accessor: 'changed_attribute',
      key: 'changed_attribute',
      Cell: ({row}) => (<div>{row.original.changed_attribute}</div>),
      sortType: ((a, b) => a.original.changed_attribute.localeCompare(b.original.changed_attribute)),
      maxWidth: 130
    },
    {
      Header: 'Previous Value',
      accessor: 'previous_value',
      key: 'previous_value',
      Cell: ({row}) => (<div>{row.original.previous_value}</div>),
      sortType: ((a, b) => a.original.previous_value.localeCompare(b.original.previous_value)),
    },
    {
      Header: 'Author',
      accessor: 'authorName',
      key: 'authorName',
      Cell: ({row}) => (<div>{row.original.authorName}</div>),
      sortType: ((a, b) => a.original.authorName.localeCompare(b.original.authorName)),
    },
    {
      Header: 'Timestamp',
      accessor: 'created_at',
      key: 'created_at',
      Cell: ({row}) => moment(row.original.created_at).format('MMMM D, YYYY [at] LT'),
      sortType:  (a, b) => (new Date(a.original.created_at) - new Date(b.original.created_at)),
      sortDescFirst: true
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
    <ReactTable
      className="change-log-table"
      columns={columns()}
      data={data}
    />
  );
};

export default ChangeLogsTable;
