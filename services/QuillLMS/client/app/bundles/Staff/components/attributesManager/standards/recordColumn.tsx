import * as React from 'react';
import { Table } from 'antd';
import moment from 'moment';

import { sortWordsThatIncludeNumbers, } from './shared'

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

function columns(selectRecord, recordType) {
  return [
    {
      title: recordType,
      dataIndex: 'name',
      defaultSortOrder: 'ascend',
      key: 'name',
      render: (text, record:RecordRow) => (<div onClick={() => selectRecord(record, recordType)}>{text}</div>),
      sorter: sortWordsThatIncludeNumbers()
    }
  ]
}

const RecordColumn: React.SFC<RecordColumnProps> = ({ records, selectRecord, recordType }) => {
  return (
    <Table
      bordered
      className="records-table"
      columns={columns(selectRecord, recordType)}
      dataSource={records}
      pagination={false}
      size="middle"
    />
  );
};

export default RecordColumn;
