import * as React from 'react';
import ReactTable from 'react-table';
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
      Header: 'Topic Name',
      accessor: 'topic_name',
      key: 'topic_name',
      Cell: (props) => (<div>{props.original.topic_name}</div>),
      sortType: ((a, b) => a.topic_name.localeCompare(b.topic_name))
    },
    {
      Header: 'Action',
      accessor: 'action',
      key: 'action',
      Cell: (props) => (<div>{props.original.action}</div>),
      sortType: ((a, b) => a.action.localeCompare(b.action)),
      maxWidth: 120
    },
    {
      Header: 'Explanation',
      accessor: 'explanation',
      key: 'explanation',
      Cell: (props) => (<div>{props.original.explanation}</div>),
      sortType: ((a, b) => a.explanation.localeCompare(b.explanation)),
      maxWidth: 250
    },
    {
      Header: 'Changed Attribute',
      accessor: 'changed_attribute',
      key: 'changed_attribute',
      Cell: (props) => (<div>{props.original.changed_attribute}</div>),
      sortType: ((a, b) => a.changed_attribute.localeCompare(b.changed_attribute)),
      maxWidth: 130
    },
    {
      Header: 'Previous Value',
      accessor: 'previous_value',
      key: 'previous_value',
      Cell: (props) => (<div>{props.original.previous_value}</div>),
      sortType: ((a, b) => a.previous_value.localeCompare(b.previous_value)),
    },
    {
      Header: 'Author',
      accessor: 'authorName',
      key: 'authorName',
      Cell: (props) => (<div>{props.original.authorName}</div>),
      sortType: ((a, b) => a.authorName.localeCompare(b.authorName)),
    },
    {
      Header: 'Timestamp',
      accessor: 'created_at',
      key: 'created_at',
      Cell: (props) => moment(props.original.created_at).format('MMMM D, YYYY [at] LT'),
      sortType:  (a, b) => (new Date(a.created_at) - new Date(b.created_at)),
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
      defaultPageSize={data.length}
      showPagination={false}
    />
  );
};

export default ChangeLogsTable;
