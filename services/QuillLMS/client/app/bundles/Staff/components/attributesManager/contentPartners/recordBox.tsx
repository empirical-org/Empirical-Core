import _ from 'lodash';
import * as React from "react";

import { Record } from './interfaces';

import { Input, TextArea } from '../../../../Shared/index';

interface RecordBoxProps {
  originalRecord: Record;
  saveContentPartnerChanges(record: Record): void,
  closeRecordBox(event): void,
  recordType: string,
}

const RecordBox = ({ originalRecord, saveContentPartnerChanges, closeRecordBox, recordType, standardCategories, standardLevels, standards, recordTypeAttribute }) => {
  const [record, setRecord] = React.useState(originalRecord)

  React.useEffect(() => { setRecord(originalRecord) }, [originalRecord])

  function handleSubmit(e) {
    e.preventDefault()
    save()
  }

  function save() {
    const { id, name, visible, description, } = record

    const recordToSave = {
      id,
      name,
      visible,
      description
    }

    saveContentPartnerChanges(recordToSave)
  }

  function toggleVisibility() {
    const newRecord = Object.assign({}, record, { visible: !record.visible })
    setRecord(newRecord)
  }

  function renameRecord(e) {
    const newRecord = Object.assign({}, record, { name: e.target.value })
    setRecord(newRecord)
  }

  function handleDescriptionChange(e) {
    const newRecord = Object.assign({}, record, { description: e.target.value })
    setRecord(newRecord)
  }

  function cancelRename(e) {
    const newRecord = Object.assign({}, record, { name: originalRecord.name })
    setRecord(newRecord)
  }

  function activateRecordInput() {
    document.getElementById('record-name').focus()
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

  function renderFields() {
    return (
      <div>
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
        <div className="record-input-container description">
          <TextArea
            characterLimit={190}
            handleChange={handleDescriptionChange}
            id='description'
            label={recordType}
            type='text'
            value={record.description}
          />
        </div>
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

  return (
    <div className="record-box">
      <span className="close-record-box" onClick={closeRecordBox}><i className="fas fa-times" /></span>
      <form acceptCharset="UTF-8" onSubmit={handleSubmit} >
        <div className="static">
          <p>{recordType}</p>
          <h1>{record.name}</h1>
        </div>
        <div className="fields">
          {renderFields()}
          {renderSaveButton()}
        </div>
      </form>
    </div>
  )
}


export default RecordBox
