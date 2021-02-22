import * as React from 'react'
import ReactTable from 'react-table';
import moment from 'moment';

import RecordBox from './recordBox'
import NewRecordBox from './newRecordBox'
import ArchivedRecordBox from './archivedRecordBox'

import { momentFormatConstants } from '../../../../Shared/index'

function columns(selectRecord, visible) {
  const sharedColumn = {
    Header: 'Content Partner',
    accessor: 'name',
    defaultSortOrder: 'ascend',
    key: 'name',
    Cell: (props) => (<button className="interactive-wrapper" onClick={() => selectRecord(props.original.id)}>{props.original.name}</button>),
    sortType: (a, b) => a.name.localeCompare(b.name)
  }
  if (visible) {
    return [
      sharedColumn,
      {
        Header: 'Activities',
        accessor: 'activity_count',
        key: 'activity_count',
        sortType:  (a, b) => (a.activity_count - b.activity_count)
      },
      {
        Header: 'Created At',
        accessor: 'created_at',
        key: 'created_at',
        Cell: (props) => moment(props.original.created_at).format(momentFormatConstants.MONTH_DAY_YEAR),
        sortType:  (a, b) => (new Date(a.created_at) - new Date(b.created_at)),
      }
    ]
  }

  return [
    sharedColumn,
    {
      Header: 'Archived At',
      accessor: 'updated_at',
      key: 'updated_at',
      Cell: (props) => moment(props.original.updated_at).format(momentFormatConstants.MONTH_DAY_YEAR),
      sortType:  (a, b) => (new Date(a.updated_at) - new Date(b.updated_at)),
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
    <ReactTable
      className="records-table"
      columns={columns(selectRecord, visible)}
      data={filteredRecords}
      defaultPageSize={filteredRecords.length}
      showPagination={false}
    />
    <div className="record-box-container">
      {recordBox}
      {newRecordBox}
    </div>
  </div>)
}

export default ContentPartnersTable
