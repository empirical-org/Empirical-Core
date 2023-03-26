import _ from 'lodash';
import moment from 'moment';
import * as React from "react";

import { Record } from './interfaces';
import { sortWordsThatIncludeNumbers, STANDARD } from './shared';

import { DropdownInput, Input, momentFormatConstants } from '../../../../Shared/index';
import ChangeLogModal from '../../shared/changeLogModal';
import IndividualRecordChangeLogs from '../../shared/individualRecordChangeLogs';

interface RecordBoxProps {
  originalRecord: Record;
  saveRecordChanges(record: Record): void,
  closeRecordBox(event): void,
  recordType: string,
  standardCategories: any,
  standardLevels: any
}

const formatDateTime = (cl) => moment(cl.created_at).format(momentFormatConstants.LONG_DATE_WITH_TIME)

const RecordBox = ({ originalRecord, saveRecordChanges, closeRecordBox, recordType, standardCategories, standardLevels, standards, recordTypeAttribute }) => {
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
    let message
    const visibilityHasChanged = originalRecord.visible !== record.visible
    if (visibilityHasChanged && recordType !== STANDARD) {
      const affectedStandards = standards.filter(s => s[recordTypeAttribute] === record.id && s.visible)
      const affectedStandardsString = affectedStandards.map(as => as.name).join('\n')
      message = `You are about to archive this ${recordType.toLowerCase()}. The following standards will also be archived if you proceed:\n\n${affectedStandardsString}`
    }
    if (!visibilityHasChanged || window.confirm(message)) {
      setShowChangeLogModal(true)
    }
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

  function toggleVisibility() {
    const newRecord = Object.assign({}, record, { visible: !record.visible })
    setRecord(newRecord)
  }

  function renameRecord(e) {
    const newRecord = Object.assign({}, record, { name: e.target.value })
    setRecord(newRecord)
  }

  function cancelRename(e) {
    const newRecord = Object.assign({}, record, { name: originalRecord.name })
    setRecord(newRecord)
  }

  function activateRecordInput() {
    document.getElementById('record-name').focus()
  }

  function renderDropdownInputs() {
    const standardLevelOptions = standardLevels.sort(sortWordsThatIncludeNumbers()).map(t => ({ value: t.id, label: t.name }))
    const standardCategoryOptions = standardCategories.sort(sortWordsThatIncludeNumbers()).map(t => ({ value: t.id, label: t.name }))
    const standardLevelValue = standardLevelOptions.find(opt => opt.value === record.standard_level_id)
    const standardCategoryValue = standardCategoryOptions.find(opt => opt.value === record.standard_category_id)
    return (
      <div>
        <DropdownInput
          handleChange={changeStandardLevel}
          isSearchable={true}
          label="Standard Level"
          options={standardLevelOptions}
          value={standardLevelValue}
        />
        <DropdownInput
          handleChange={changeStandardCategory}
          isSearchable={true}
          label="Standard Category"
          options={standardCategoryOptions}
          value={standardCategoryValue}
        />
      </div>
    )
  }

  function renderRenameAndArchiveSection() {
    return (
      <div className="rename-and-archive">
        <span className="rename" onClick={activateRecordInput}>
          <i className="fas fa-edit" />
          <span>Rename</span>
        </span>
        <span className="archive" onClick={toggleVisibility}>
          <i className="fas fa-archive" />
          <span>{ record.visible ? 'Archive' : 'Unarchive' }</span>
        </span>
      </div>
    )
  }

  function renderLevels() {
    const dropdowns = recordType === STANDARD ? renderDropdownInputs() : null

    return (
      <div>
        {dropdowns}
        <div className="record-input-container">
          <Input
            handleCancel={cancelRename}
            handleChange={renameRecord}
            id='record-name'
            label={recordType}
            type='text'
            value={record.name}
          />
          {renderRenameAndArchiveSection()}
        </div>
        <IndividualRecordChangeLogs changeLogs={record.change_logs} formatDateTime={formatDateTime} />
      </div>
    )
  }

  function renderSaveButton() {
    if (!_.isEqual(record, originalRecord)) {
      return (
        <input
          className="quill-button contained primary medium"
          type="submit"
          value="Save"
        />
      )
    }
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


export default RecordBox
