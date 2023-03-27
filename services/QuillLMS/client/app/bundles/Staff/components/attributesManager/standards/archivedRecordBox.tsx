import moment from 'moment';
import * as React from "react";

import { Record, StandardCategory, StandardLevel } from './interfaces';
import { sortWordsThatIncludeNumbers, STANDARD } from './shared';

import { DropdownInput, Input, momentFormatConstants } from '../../../../Shared/index';
import ChangeLogModal from '../../shared/changeLogModal';
import IndividualRecordChangeLogs from '../../shared/individualRecordChangeLogs';

interface ArchivedRecordBoxProps {
  originalRecord: Record;
  saveRecordChanges(record: Record): void,
  closeRecordBox(event): void,
  recordType: string,
  standardLevels: StandardLevel[],
  standardCategories: StandardCategory[]
}

const formatDateTime = (cl) => moment(cl.created_at).format(momentFormatConstants.LONG_DATE_WITH_TIME)

const ArchivedRecordBox = ({ originalRecord, recordType, standardLevels, standardCategories, saveRecordChanges, closeRecordBox, }: ArchivedRecordBoxProps) => {
  const [showChangeLogModal, setShowChangeLogModal] = React.useState(false)
  const [record, setRecord] = React.useState(originalRecord)
  const [changeLogs, setChangeLogs] = React.useState([])

  React.useEffect(() => {
    if (changeLogs.length) {
      save()
    }
  }, [changeLogs])
  React.useEffect(() => { setRecord(originalRecord) }, [originalRecord])

  function handleSubmit(e) {
    e.preventDefault()
    const newRecord = Object.assign({}, record, { visible: true })
    setRecord(newRecord)
    setShowChangeLogModal(true)
  }

  function closeChangeLogModal() {
    setShowChangeLogModal(false)
  }

  function save() {
    const { id, name, visible, standard_level_id, standard_category_id, } = record
    const formattedChangeLogs = changeLogs.map(cl => {
      const { action, explanation, changedAttribute, newValue, previousValue, recordID, } = cl
      return {
        action,
        explanation,
        changed_attribute: changedAttribute,
        previous_value: previousValue,
        new_value: newValue,
        changed_record_id: recordID,
        changed_record_type: recordType.split(" ").join("")
      }
    })

    const recordToSave = {
      id,
      name,
      visible,
      change_logs_attributes: formattedChangeLogs
    }

    if (recordType === STANDARD) {
      recordToSave.standard_category_id = standard_category_id
      recordToSave.standard_level_id = standard_level_id
    }

    saveRecordChanges(recordToSave)
    setShowChangeLogModal(false)
  }

  function changeStandardCategory(standardCategory) {
    const newRecord = Object.assign({}, record, { standard_category_id: standardCategory.value })
    setRecord(newRecord)
  }

  function changeStandardLevel(standardLevel) {
    const newRecord = Object.assign({}, record, { standard_level_id: standardLevel.value })
    setRecord(newRecord)
  }

  function renderDropdownInputs() {
    const standardLevelOptions = standardLevels.sort(sortWordsThatIncludeNumbers()).map(t => ({ value: t.id, label: t.name }))
    const selectedStandardLevel = standardLevels.find(sl => sl.id === record.standard_level_id)
    const standardLevelValue = standardLevelOptions.find(opt => opt.value === record.standard_level_id)
    const standardCategoryOptions = standardCategories.sort(sortWordsThatIncludeNumbers()).map(t => ({ value: t.id, label: t.name }))
    const selectedStandardCategory = standardCategories.find(sl => sl.id === record.standard_category_id)
    const standardCategoryValue = standardCategoryOptions.find(opt => opt.value === record.standard_category_id)
    return (
      <div>
        <div className="record-input-container">
          <DropdownInput
            handleChange={changeStandardLevel}
            isSearchable={true}
            label="Standard Level"
            options={standardLevelOptions}
            value={standardLevelValue}
          />
          {renderArchivedOrLive(selectedStandardLevel)}
        </div>
        <div className="record-input-container">
          <DropdownInput
            handleChange={changeStandardCategory}
            isSearchable={true}
            label="Standard Category"
            options={standardCategoryOptions}
            value={standardCategoryValue}
          />
          {renderArchivedOrLive(selectedStandardCategory)}
        </div>
      </div>
    )
  }

  function renderArchivedOrLive(r) {
    if (!r) { return }
    if (r.visible) {
      return (
        <div className="live-or-archived">
          <div>
            <div className="live" />
            Live
          </div>
        </div>
      )
    }

    return (
      <div className="live-or-archived">
        <div>
          <div className="archived" />
          Archived
        </div>
        <div className="date">{moment(r.updated_at).format('M/D/YY')}</div>
      </div>
    )
  }

  function renderLevels() {
    const dropdown = recordType === STANDARD ? renderDropdownInputs() : null

    return (
      <div>
        {dropdown}
        <div className="record-input-container">
          <Input
            disabled={true}
            label={recordType}
            type='text'
            value={record.name}
          />
          {renderArchivedOrLive(record)}
        </div>
        <IndividualRecordChangeLogs changeLogs={record.change_logs} formatDateTime={formatDateTime} />
      </div>
    )
  }

  function renderSaveButton() {
    const { standard_category_id, standard_level_id, } = record
    const hasStandardCategoryAndLevelIfStandard = recordType === STANDARD ? standard_category_id && standard_level_id && standardCategories.find(t => t.id === record.standard_category_id).visible && standardLevels.find(t => t.id === record.standard_level_id).visible : true

    if (!hasStandardCategoryAndLevelIfStandard) {
      return (
        <input
          className="quill-button contained disabled primary medium"
          type="submit"
          value="Unarchive, set live"
        />
      )
    }

    return (
      <input
        className="quill-button contained primary medium"
        type="submit"
        value="Unarchive, set live"
      />
    )
  }

  function renderChangeLogModal() {
    if (!showChangeLogModal) { return }

    const changedFields = []
    Object.keys(record).forEach(key => {
      if (record[key] !== originalRecord[key]) {
        let changedField = { fieldName: key, previousValue: originalRecord[key], newValue: record[key]}
        changedFields.push(changedField)
      }
    })
    return (
      <ChangeLogModal
        cancel={closeChangeLogModal}
        changedFields={changedFields}
        record={record}
        save={setChangeLogs}
      />
    )
  }

  return (
    <div className="record-box">
      {renderChangeLogModal()}
      <span className="close-record-box" onClick={closeRecordBox}><i className="fas fa-times" /></span>
      <form acceptCharset="UTF-8" onSubmit={handleSubmit} >
        <div className="static">
          <p>{recordType}</p>
          <h1>{record.name}</h1>
        </div>
        <div className="fields">
          {renderLevels()}
          {renderSaveButton()}
        </div>
      </form>
    </div>
  )
}


export default ArchivedRecordBox
