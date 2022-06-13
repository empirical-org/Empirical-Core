import * as React from 'react';
import moment from 'moment';

import { ChangeLog } from '../../../interfaces/interfaces';
import { momentFormatConstants, ReactTable, } from '../../../../Shared/index'

interface ChangeLogsTableProps {
  changeLogs: Array<ChangeLog>
}

interface ChangeLogRow {
  key: string;
  record_name:string;
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
      Header: 'Record Type',
      accessor: 'changed_record_type',
      key: 'changed_record_type',
      Cell: ({row}) => (<div>{row.original.changed_record_type}</div>),
      sortType: ((a, b) => a.original.record_name.localeCompare(b.original.record_name))
    },
    {
      Header: 'Record Name',
      accessor: 'record_name',
      key: 'record_name',
      Cell: ({row}) => (<div>{row.original.record_name}</div>),
      sortType: ((a, b) => a.original.record_name.localeCompare(b.original.record_name))
    },
    {
      Header: 'Action',
      accessor: 'action',
      key: 'action',
      Cell: ({row}) => (<div>{row.original.action}</div>),
      sortType: ((a, b) => a.original.action.localeCompare(b.original.action)),
      width: 120
    },
    {
      Header: 'Explanation',
      accessor: 'explanation',
      key: 'explanation',
      Cell: ({row}) => (<div>{row.original.explanation}</div>),
      sortType: ((a, b) => a.original.explanation.localeCompare(b.original.explanation)),
      width: 250
    },
    {
      Header: 'Changed Attribute',
      accessor: 'changed_attribute',
      key: 'changed_attribute',
      Cell: ({row}) => (<div>{row.original.changed_attribute}</div>),
      sortType: ((a, b) => a.original.changed_attribute.localeCompare(b.original.changed_attribute)),
      width: 130
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
      render: ({row}) => moment(row.original.created_at).format(momentFormatConstants.LONG_DATE_WITH_TIME),
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
    record_name: changeLog.record_name,
    changed_record_type: changeLog.changed_record_type,
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
    />
  );
};

export default ChangeLogsTable;
