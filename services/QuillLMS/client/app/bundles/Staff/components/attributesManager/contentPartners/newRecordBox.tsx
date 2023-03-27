import * as React from "react";

import { Record } from './interfaces';

import { Input, TextArea } from '../../../../Shared/index';

interface NewRecordBoxProps {
  createNewContentPartner(record: Record): void,
  closeRecordBox(event): void,
}

const NewRecordBox = ({ createNewContentPartner, closeRecordBox, }: NewRecordBoxProps) => {
  const defaultRecord: Record = { name: '', visible: true, description: '' }
  const [record, setRecord] = React.useState(defaultRecord)

  function handleSubmit(e) {
    e.preventDefault()
    save()
  }

  function save() {
    createNewContentPartner(record)
  }

  function renameRecord(e) {
    const newRecord = Object.assign({}, record, { name: e.target.value })
    setRecord(newRecord)
  }

  function handleDescriptionChange(e) {
    const newRecord = Object.assign({}, record, { description: e.target.value })
    setRecord(newRecord)
  }


  function renderFields() {
    return (
      <div>
        <div className="record-input-container">
          <Input
            handleChange={renameRecord}
            label="Content Partner"
            type='text'
            value={record.name}
          />
        </div>
        <div className="record-input-container description">
          <TextArea
            characterLimit={190}
            handleChange={handleDescriptionChange}
            id='description'
            label="Description"
            value={record.description}
          />
        </div>
      </div>
    )
  }

  function renderSaveButton() {
    const { name, } = record
    if (name.length) {
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
    <div className="record-box create-record-box">
      <span className="close-record-box" onClick={closeRecordBox}><i className="fas fa-times" /></span>
      <form acceptCharset="UTF-8" onSubmit={handleSubmit} >
        <div className="static">
          <p>Create a Content Partner</p>
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
