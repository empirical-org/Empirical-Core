import * as React from 'react';
import { Table } from 'antd';
import moment from 'moment';

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
  let sharedColumns = [
    {
      title: recordType,
      dataIndex: 'name',
      defaultSortOrder: 'ascend',
      key: 'name',
      render: (text, record:RecordRow) => (<div onClick={() => selectRecord(record, recordType)}>{text}</div>),
      sorter:  (a, b) => {
        const numberRegex = /(\d+)/g
        const aNumberMatch = a.name.match(numberRegex)
        const bNumberMatch = b.name.match(numberRegex)
        if (aNumberMatch && bNumberMatch) {
          return (Number(aNumberMatch[0]) - Number((bNumberMatch[0])))
        }

        if (aNumberMatch) { return 1 }
        if (bNumberMatch) { return -1 }

        return (a.name.localeCompare(b.name))
      },
    }
  ]

  return sharedColumns
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
