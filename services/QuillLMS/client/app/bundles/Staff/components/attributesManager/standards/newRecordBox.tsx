import * as React from "react";
import _ from 'lodash'

import { STANDARD, sortWordsThatIncludeNumbers, } from './shared'
import { Record } from './interfaces'

import ChangeLogModal from '../../shared/changeLogModal'
import { Input, DropdownInput, } from '../../../../Shared/index'

interface NewRecordBoxProps {
  createNewRecord(record: Record): void,
  closeRecordBox(event): void,
  recordType: string,
  standardCategories: any,
  standardLevels: any
}

const NewRecordBox = ({ recordType, createNewRecord, closeRecordBox, standardCategories, standardLevels, }: NewRecordBoxProps) => {
  const defaultRecord: Record = { name: '', visible: true }
  if (recordType === STANDARD) {
    defaultRecord.standard_category_id = null
    defaultRecord.standard_level_id = null
  }
  const [showChangeLogModal, setShowChangeLogModal] = React.useState(false)
  const [record, setRecord] = React.useState(defaultRecord)
  const [changeLogs, setChangeLogs] = React.useState([])

  React.useEffect(() => {
    if (changeLogs.length) {
      save()
    }
  }, [changeLogs])

  function handleSubmit(e) {
    e.preventDefault()
    setShowChangeLogModal(true)
  }

  function closeChangeLogModal() {
    setShowChangeLogModal(false)
  }

  function save() {
    const { name, visible, standard_category_id, standard_level_id, } = record
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
      name,
      visible,
      change_logs_attributes: formattedChangeLogs
    }

    if (recordType === STANDARD) {
      recordToSave.standard_category_id = standard_category_id
      recordToSave.standard_level_id = standard_level_id
    }

    createNewRecord(recordToSave)
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

  function renameRecord(e) {
    const newRecord = Object.assign({}, record, { name: e.target.value })
    setRecord(newRecord)
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

  function renderFields() {
    const dropdowns = recordType === STANDARD ? renderDropdownInputs() : null

    return (
      <div>
        {dropdowns}
        <div className="record-input-container">
          <Input
            handleChange={renameRecord}
            label={recordType}
            type='text'
            value={record.name}
          />
        </div>
      </div>
    )
  }

  function renderSaveButton() {
    const { name, standard_category_id, standard_level_id, } = record
    const hasStandardCategoryAndLevelIfStandard = recordType === STANDARD ? standard_category_id && standard_level_id : true
    if (name.length && hasStandardCategoryAndLevelIfStandard) {
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

    return (
      <ChangeLogModal
        cancel={closeChangeLogModal}
        changedFields={[{ fieldName: 'new' }]}
        record={record}
        save={setChangeLogs}
      />
    )
  }

  return (
    <div className="record-box create-record-box">
      {renderChangeLogModal()}
      <span className="close-record-box" onClick={closeRecordBox}><i className="fas fa-times" /></span>
      <form acceptCharset="UTF-8" onSubmit={handleSubmit} >
        <div className="static">
          <p>Create a {recordType}</p>
        </div>
        <div className="fields">
          {renderFields()}
          {renderSaveButton()}
        </div>
      </form>
    </div>
  )
}


export default NewRecordBox
