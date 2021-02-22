import * as React from 'react';
import ReactTable from 'react-table';

import { sortWordsThatIncludeNumbers, } from './shared'

import { getColumnWidth, } from '../../shared/getColumnWidth'

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
      Cell: (props) => (<button className="interactive-wrapper" onClick={() => selectRecord(props.original, recordType)}>{props.original.name}</button>),
      sorter: sortWordsThatIncludeNumbers(),
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
      showPagination={false}
    />
  );
};

export default RecordColumn;
