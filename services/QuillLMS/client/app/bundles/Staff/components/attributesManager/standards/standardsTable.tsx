import * as React from 'react'
import { Table } from 'antd';
import moment from 'moment';

import RecordBox from './recordBox'
import { sortWordsThatIncludeNumbers, STANDARD, STANDARD_CATEGORY, STANDARD_LEVEL} from './shared'

function columns(selectRecord) {
  return [
    {
      title: 'Standard Level',
      dataIndex: 'standard_level_name',
      defaultSortOrder: 'ascend',
      key: 'standardLevelName',
      render: (text, record) => (<div onClick={() => selectRecord(record.standard_level_id, STANDARD_LEVEL)}>{text}</div>),
      sorter: sortWordsThatIncludeNumbers('standard_level_name')
    },
    {
      title: 'Activities',
      dataIndex: 'standard_level_activity_count',
      key: 'standardLevelActivityCount',
      sorter:  (a, b) => (a.standard_level_activity_count - b.standard_level_activity_count)
    },
    {
      title: 'Standard Category',
      dataIndex: 'standard_category_name',
      key: 'standardCategoryName',
      render: (text, record) => (<div onClick={() => selectRecord(record.standard_category_id, STANDARD_CATEGORY)}>{text}</div>),
      sorter: sortWordsThatIncludeNumbers('standard_category_name')
    },
    {
      title: 'Activities',
      dataIndex: 'standard_category_activity_count',
      key: 'standardCategoryActivityCount',
      sorter:  (a, b) => (a.standard_category_activity_count - b.standard_category_activity_count)
    },
    {
      title: 'Standard ',
      dataIndex: 'name',
      key: 'standardName',
      render: (text, record) => (<div onClick={() => selectRecord(record.id, STANDARD)}>{text}</div>),
      sorter: sortWordsThatIncludeNumbers()
    },
    {
      title: 'Activities',
      dataIndex: 'activity_count',
      key: 'standardActivityCount',
      sorter:  (a, b) => (a.activity_count - b.activity_count)
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => moment(text).format('M/D/YY'),
      sorter:  (a, b) => (new Date(a.created_at) - new Date(b.created_at)),
    }
  ]
}

const StandardsTable = ({ searchValue, standardCategories, standardLevels, recordTypes, standards, }) => {
  const [selectedRecordId, setSelectedRecordId] = React.useState(null)
  const [selectedRecordType, setSelectedRecordType] = React.useState(null)

  function closeRecordBox() {
    setSelectedRecordId(null)
    setSelectedRecordType(null)
  }

  function selectRecord(id, recordType) {
    setSelectedRecordId(id)
    setSelectedRecordType(recordType)
  }

  let recordBox

  const sharedRecordBoxProps = {
    closeRecordBox,
    standardCategories: standardCategories.filter(sc => sc.visible),
    standardLevels: standardLevels.filter(sl => sl.visible),
    standards: standards.filter(s => s.visible),
    recordType: selectedRecordType
  }

  if (selectedRecordId) {
    const recordType = recordTypes.find(rt => rt.recordType === selectedRecordType)
    const recordBoxProps = {
      ...sharedRecordBoxProps,
      originalRecord: recordType.records.find(r => r.id === selectedRecordId),
      saveRecordChanges: recordType.saveChanges,
      recordTypeAttribute: recordType.attribute
    }
    recordBox = <RecordBox {...recordBoxProps} />
  }

  const records = standards.map(s => {
    const standardLevel = standardLevels.find(sl => sl.id === s.standard_level_id)
    const standardCategory = standardCategories.find(sc => sc.id === s.standard_category_id)
    s.standard_level_name = standardLevel ? standardLevel.name : null
    s.standard_level_activity_count = standardLevel ? standardLevel.activity_count : null
    s.standard_category_name = standardCategory ? standardCategory.name : null
    s.standard_category_activity_count = standardCategory ? standardCategory.activity_count : null
    return s
  })

  const filteredRecords = records.filter(r => {
    const standardLevelNameMatchesSearch = r.standard_level_name && r.standard_level_name.toLowerCase().includes(searchValue.toLowerCase())
    const standardCategoryNameMatchesSearch = r.standard_category_name && r.standard_category_name.toLowerCase().includes(searchValue.toLowerCase())
    const standardNameMatchesSearch = r.name.toLowerCase().includes(searchValue.toLowerCase())
    return r.visible === true && (standardLevelNameMatchesSearch || standardCategoryNameMatchesSearch || standardNameMatchesSearch)
  })

  return (<div className="standard-columns">
    <Table
      bordered
      className="records-table"
      columns={columns(selectRecord)}
      dataSource={filteredRecords}
      pagination={false}
      size="middle"
    />
    <div className="record-box-container">
      {recordBox}
    </div>
  </div>)
}

export default StandardsTable
