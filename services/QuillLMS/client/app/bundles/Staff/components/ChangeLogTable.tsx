import moment from 'moment';
import * as React from 'react';

import { ReactTable } from '../../Shared/index';
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
      Header: 'Concept Name',
      accessor: 'conceptName',
      key: 'conceptName',
      Cell: ({row}) => (<div>{row.original.conceptName}</div>),
      sortType: ((a, b) => a.original.conceptName.localeCompare(b.original.conceptName))
    },
    {
      Header: 'UID',
      accessor: 'conceptUID',
      key: 'conceptUID',
      Cell: ({row}) => (<div>{row.original.conceptUID}</div>),
      sortType: ((a, b) => a.original.conceptUID.localeCompare(b.original.conceptUID)),
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
      accessor: 'changedAttribute',
      key: 'changedAttribute',
      Cell: ({row}) => (<div>{row.original.changedAttribute}</div>),
      sortType: ((a, b) => a.original.changedAttribute.localeCompare(b.original.changedAttribute)),
      maxWidth: 130
    },
    {
      Header: 'Previous Value',
      accessor: 'previousValue',
      key: 'previousValue',
      Cell: ({row}) => (<div>{row.original.previousValue}</div>),
      sortType: ((a, b) => a.original.previousValue.localeCompare(b.original.previousValue)),
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
      accessor: 'createdAt',
      key: 'createdAt',
      Cell: ({row}) => moment.unix(row.original.createdAt).format('MMMM D, YYYY [at] LT'),
      sortType:  (a, b) => (a.original.createdAt - b.original.createdAt),
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
    <ReactTable
      className="concepts-table"
      columns={columns()}
      data={data}
    />
  );
};

export default ChangeLogsTable;
