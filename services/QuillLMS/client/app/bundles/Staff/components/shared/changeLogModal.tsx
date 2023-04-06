import React from 'react';
import { TextArea } from '../../../Shared/index';

import { Concept } from '../../interfaces/interfaces';

interface ChangeLogModalProps {
  changedFields: Array<{ fieldName: string; previousValue?: any, newValue?: any }>;
  cancel(event): void;
  save(event): void;
  record: Concept|any;
  levelNumber?: number;
}

interface ChangeLogModalState {
  [key:string]: { action: string, explanation: string, recordID?: string }
}

export default class ChangeLogModal extends React.Component<ChangeLogModalProps, ChangeLogModalState> {
  constructor(props) {
    super(props)

    const stateObj = {}
    props.changedFields.forEach((field, i) => {
      stateObj[`changeLog${i}`] = {
        action: this.fieldToActionNameMap()[field.fieldName],
        explanation: '',
        recordID: props.record.id,
        previousValue: field.previousValue !== null ? String(field.previousValue) : null,
        newValue: field.newValue !== null ? String(field.newValue) : null,
        changedAttribute: field.fieldName
      }
    })

    this.state = stateObj

    this.updateExplanation = this.updateExplanation.bind(this)
    this.renderChangeLogFields = this.renderChangeLogFields.bind(this)
  }

  fieldToActionNameMap() {
    const { levelNumber, record, } = this.props
    return {
      name: 'Renamed',
      parent_id: `Level ${levelNumber + 1} updated`,
      visible: record.visible ? 'Unarchived' : 'Archived',
      description: 'Rule description updated',
      explanation: 'Explanation updated',
      new: 'Created',
      replaced: 'Replaced',
      standard_category_id: 'Standard category updated',
      standard_level_id: 'Standard level updated'
    }
  }

  updateExplanation(key, e) {
    const changeLog = this.state[key]
    changeLog.explanation = e.target.value
    this.setState({ [key]: changeLog })
  }

  handleClickSave = (e) => {
    e.preventDefault()
    const { save, } = this.props
    const changeLogs = Object.keys(this.state).map(key => this.state[key])
    save(changeLogs)
  }

  renderChangeLogFields() {
    return Object.keys(this.state).map(key => {
      return (
        <TextArea
          characterLimit={800}
          handleChange={(e) => {this.updateExplanation(key, e)}}
          id={key}
          key={key}
          label={`Action Explanation: ${this.state[key].action}`}
          timesSubmitted={0}
          value={this.state[key].explanation}
        />
      )
    })
  }

  renderButtons() {
    const { cancel, } = this.props
    let saveButtonClass = 'quill-button contained primary medium';
    const allChangesEntered = Object.keys(this.state).every(key => this.state[key].explanation.length > 9)
    if (!allChangesEntered) {
      saveButtonClass += ' disabled';
    }
    return (
      <div className="buttons">
        <button className="quill-button medium secondary outlined" onClick={cancel}>Cancel</button>
        <button className={saveButtonClass} onClick={this.handleClickSave}>Save</button>
      </div>
    )
  }

  render() {
    return (
      <div className="change-log-modal-container">
        <div className="modal-background" />
        <div className="change-log-modal">
          <h1>Describe what action you took and why.</h1>
          <p>Be as specific as possible. For example, if you rename a record, include the record's original name in the description. If you archive a record because it was a duplicate, include the UID of the record being retained.</p>
          <form acceptCharset="UTF-8" >
            {this.renderChangeLogFields()}
            {this.renderButtons()}
          </form>
        </div>
      </div>
    )
  }
}
