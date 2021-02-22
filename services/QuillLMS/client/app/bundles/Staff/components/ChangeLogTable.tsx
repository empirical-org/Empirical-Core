import * as React from 'react';
import ReactTable from 'react-table';

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
  changedAttribute:string;
  previousValue:string;
}

function columns() {
  return [
    {
      Header: 'Concept Name',
      accessor: 'conceptName',
      key: 'conceptName',
      Cell: (props) => (<div>{props.original.conceptName}</div>),
      sortType: ((a, b) => a.conceptName.localeCompare(b.conceptName))
    },
    {
      Header: 'UID',
      accessor: 'conceptUID',
      key: 'conceptUID',
      Cell: (props) => (<div>{props.original.conceptUID}</div>),
      sortType: ((a, b) => a.conceptUID.localeCompare(b.conceptUID)),
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
      accessor: 'changedAttribute',
      key: 'changedAttribute',
      Cell: (props) => (<div>{props.original.changedAttribute}</div>),
      sortType: ((a, b) => a.changedAttribute.localeCompare(b.changedAttribute)),
      maxWidth: 130
    },
    {
      Header: 'Previous Value',
      accessor: 'previousValue',
      key: 'previousValue',
      Cell: (props) => (<div>{props.original.previousValue}</div>),
      sortType: ((a, b) => a.previousValue.localeCompare(b.previousValue)),
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
      accessor: 'createdAt',
      key: 'createdAt',
      Cell: (props) => moment.unix(props.original.createdAt).format('MMMM D, YYYY [at] LT'),
      sortType:  (a, b) => (a.createdAt - b.createdAt),
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
      defaultPageSize={data.length}
      showPagination={false}
    />
  );
};

export default ChangeLogsTable;
