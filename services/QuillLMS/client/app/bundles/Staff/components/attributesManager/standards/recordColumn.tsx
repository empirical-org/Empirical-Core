import * as React from 'react';

import { tableSortWordsThatIncludeNumbers, } from './shared'

import { getColumnWidth, } from '../../shared/getColumnWidth'
import { ReactTable, } from '../../../../Shared/index'

interface RecordColumnProps {
  records: Array<any>,
  recordType: string,
  selectRecord: Function,
}

interface RecordRow {
  key: string;
  recordName:string;
  recordId:string;
  createdAt:number;
}

function columns(selectRecord, recordType, records) {
  return [
    {
      Header: recordType,
      accessor: 'name',
      key: 'name',
      Cell: ({row}) => (<button className="interactive-wrapper" onClick={() => selectRecord(row.original, recordType)}>{row.original.name}</button>),
      sortType: tableSortWordsThatIncludeNumbers(),
      width: getColumnWidth('name', recordType, records)
    }
  ]
}

const RecordColumn: React.SFC<RecordColumnProps> = ({ records, selectRecord, recordType }) => {
  return (
    <ReactTable
      className="records-table"
      columns={columns(selectRecord, recordType, records)}
      data={records}
      defaultPageSize={records.length}
    />
  );
};

export default RecordColumn;
