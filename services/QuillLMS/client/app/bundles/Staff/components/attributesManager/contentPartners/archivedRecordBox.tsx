import * as React from "react";
import _ from 'lodash'
import moment from 'moment'

import { Record } from './interfaces'

import { Input, TextArea, } from '../../../../Shared/index'

interface ArchivedRecordBoxProps {
  originalRecord: Record;
  saveContentPartnerChanges(record: { id: number, visible: boolean, }): void,
  closeRecordBox(event): void
}

const ArchivedRecordBox = ({ originalRecord, saveContentPartnerChanges, closeRecordBox, }: ArchivedRecordBoxProps) => {
  const [record, setRecord] = React.useState(originalRecord)

  React.useEffect(() => { setRecord(originalRecord) }, [originalRecord])

  function handleSubmit(e) {
    e.preventDefault()
    save()
  }

  function save() {
    const { id, } = record

    const recordToSave = {
      id,
      visible: true
    }

    saveContentPartnerChanges(recordToSave)
  }

  function renderArchivedOrLive() {
    if (record.visible) {
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
        <div className="date">{moment(record.updated_at).format('M/D/YY')}</div>
      </div>
    )
  }

  function renderFields() {
    return (
      <div>
        <div className="record-input-container">
          <Input
            disabled={true}
            label="Content Partner"
            type='text'
            value={record.name}
          />
          {renderArchivedOrLive()}
        </div>
        <div className="record-input-container description">
          <TextArea
            disabled={true}
            label="Description"
            type='text'
            value={record.description}
          />
        </div>
      </div>
    )
  }

  function renderSaveButton() {
    return (
      <input
        className="quill-button contained primary medium"
        type="submit"
        value="Unarchive, set live"
      />
    )
  }

  return (
    <div className="record-box">
      <span className="close-record-box" onClick={closeRecordBox}><i className="fas fa-times" /></span>
      <form acceptCharset="UTF-8" onSubmit={handleSubmit} >
        <div className="static">
          <p>Content Partner</p>
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


export default ArchivedRecordBox
