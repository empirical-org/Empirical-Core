import * as React from 'react'
import { Table } from 'antd';
import moment from 'moment';

import RecordBox from './recordBox'
import NewRecordBox from './newRecordBox'
import ArchivedRecordBox from './archivedRecordBox'

import { momentFormatConstants } from '../../../../Shared/index'

function columns(selectRecord, visible) {
  const sharedColumn = {
    title: 'Content Partner',
    dataIndex: 'name',
    defaultSortOrder: 'ascend',
    key: 'name',
    render: (text, record) => (<button className="interactive-wrapper" onClick={() => selectRecord(record.id)}>{text}</button>),
    sorter: (a, b) => a.name.localeCompare(b.name)
  }
  if (visible) {
    return [
      sharedColumn,
      {
        title: 'Activities',
        dataIndex: 'activity_count',
        key: 'activity_count',
        sorter:  (a, b) => (a.activity_count - b.activity_count)
      },
      {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text) => moment(text).format(momentFormatConstants.MONTH_DAY_YEAR),
        sorter:  (a, b) => (new Date(a.created_at) - new Date(b.created_at)),
      }
    ]
  }

  return [
    sharedColumn,
    {
      title: 'Archived At',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (text) => moment(text).format(momentFormatConstants.MONTH_DAY_YEAR),
      sorter:  (a, b) => (new Date(a.updated_at) - new Date(b.updated_at)),
    }
  ]
}

const ContentPartnersTable = ({ visible, contentPartners, saveContentPartnerChanges, createNewContentPartner, }) => {
  const [selectedRecordId, setSelectedRecordId] = React.useState(null)

  function closeRecordBox() {
    setSelectedRecordId(null)
  }

  function selectRecord(id) {
    setSelectedRecordId(id)
  }

  let recordBox

  if (selectedRecordId) {
    const recordBoxProps = {
      closeRecordBox,
      originalRecord: contentPartners.find(r => r.id === selectedRecordId),
      saveContentPartnerChanges: saveContentPartnerChanges
    }
    recordBox = visible ? <RecordBox {...recordBoxProps} /> : <ArchivedRecordBox {...recordBoxProps} />
  }

  const filteredRecords = contentPartners.filter(r => r.visible === visible)

  const newRecordBox = createNewContentPartner && (<NewRecordBox
    closeRecordBox={closeRecordBox}
    createNewContentPartner={createNewContentPartner}
  />)

  return (<div className="content-partner-columns">
    <Table
      bordered
      className="records-table"
      columns={columns(selectRecord, visible)}
      dataSource={filteredRecords}
      pagination={false}
      showSorterTooltip={false}
      size="middle"
    />
    <div className="record-box-container">
      {recordBox}
      {newRecordBox}
    </div>
  </div>)
}

export default ContentPartnersTable
