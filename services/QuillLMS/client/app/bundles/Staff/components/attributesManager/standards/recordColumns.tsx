import * as React from 'react'

import RecordColumn from './recordColumn'
import RecordBox from './recordBox'
import ArchivedRecordBox from './archivedRecordBox'
import NewRecordBox from './newRecordBox'

const RecordColumns = ({ searchValue, visible, isNew, standardCategories, standardLevels, recordTypes, standards, }) => {
  const [selectedRecordId, setSelectedRecordId] = React.useState(null)
  const [selectedRecordType, setSelectedRecordType] = React.useState(null)

  function closeRecordBox() {
    setSelectedRecordId(null)
    setSelectedRecordType(null)
  }

  function selectRecord(record, recordType) {
    setSelectedRecordId(record.id)
    setSelectedRecordType(recordType)
  }

  let recordBox
  let newRecordBoxes

  const sharedRecordBoxProps = {
    closeRecordBox,
    standardCategories: visible ? standardCategories.filter(sc => sc.visible) : standardCategories,
    standardLevels: visible ? standardLevels.filter(sl => sl.visible) : standardLevels,
    standards: visible ? standards.filter(s => s.visible) : standards,
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
    recordBox = visible ? <RecordBox {...recordBoxProps} /> : <ArchivedRecordBox {...recordBoxProps} />
  }

  if (isNew) {
    newRecordBoxes = recordTypes.map(rt => (<NewRecordBox
      {...sharedRecordBoxProps}
      createNewRecord={rt.createNew}
      recordType={rt.recordType}
    />))
  }

  const recordColumns = recordTypes.map(rt => {
    const filteredRecords = rt.records.filter(t => t.visible === visible && t.name.toLowerCase().includes(searchValue.toLowerCase()))
    return (
      <RecordColumn
        records={filteredRecords}
        recordType={rt.recordType}
        selectRecord={selectRecord}
        visible={visible}
      />
    )
  })

  return (
    <div className="standard-columns">
      {recordColumns}
      <div className="record-box-container">
        {recordBox}
        {newRecordBoxes}
      </div>
    </div>
  )
}

export default RecordColumns
