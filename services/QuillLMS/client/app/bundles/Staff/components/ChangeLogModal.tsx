import React from 'react'
import { TextField } from 'quill-component-library/dist/componentLibrary'

import { Concept } from '../interfaces/interfaces'

interface ChangeLogModalProps {
  changedFields: Array<{ fieldName: string; previousValue?: any, newValue?: any }>;
  cancel(event): void;
  save(event): void;
  concept: Concept;
  levelNumber?: number;
}

interface ChangeLogModalState {
  [key:string]: { action: string, explanation: string, conceptID?: string }
}

export default class ChangeLogModal extends React.Component<ChangeLogModalProps, ChangeLogModalState> {
  constructor(props) {
    super(props)

    const stateObj = {}
    props.changedFields.forEach((field, i) => {
      stateObj[`changeLog${i}`] = {
        action: this.fieldToActionNameMap()[field.fieldName],
        explanation: '',
        conceptID: props.concept.id,
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
    const { levelNumber, concept, } = this.props
    return {
      name: 'Renamed',
      parent_id: `Level ${levelNumber + 1} updated`,
      visible: concept.visible ? 'Unarchived' : 'Archived',
      description: 'Rule description updated',
      new: 'Created',
      replaced: 'Replaced'
    }
  }

  updateExplanation(key, e) {
    const changeLog = this.state[key]
    changeLog.explanation = e.target.value
    this.setState({ [key]: changeLog })
  }

  renderChangeLogFields() {
    return Object.keys(this.state).map(key => {
      return <TextField
        label={`Action Explanation: ${this.state[key].action}`}
        value={this.state[key].explanation}
        id={key}
        handleChange={(e) => {this.updateExplanation(key, e)}}
        timesSubmitted={0}
        characterLimit={800}
      />
    })
  }

  renderButtons() {
    const { save, cancel, } = this.props
    let saveButtonClass = 'quill-button contained primary medium';
    const allChangesEntered = Object.keys(this.state).every(key => this.state[key].explanation.length > 9)
    const changeLogs = Object.keys(this.state).map(key => this.state[key])
    if (!allChangesEntered) {
      saveButtonClass += ' disabled';
    }
    return (<div className="buttons">
      <button className="quill-button medium secondary outlined" onClick={cancel}>Cancel</button>
      <button className={saveButtonClass} onClick={() => save(changeLogs)}>Save</button>
    </div>)
  }

  render() {
    return <div className="change-log-modal-container">
      <div className="modal-background" />
      <div className="change-log-modal">
        <h1>Describe what action you took and why.</h1>
        <p>Be as specific as possible. For example, if you rename a concept, include the concept's original name in the description. If you archive a concept because it was a duplicate, include the UID of the concept being retained.</p>
        <form acceptCharset="UTF-8" >
          {this.renderChangeLogFields()}
          {this.renderButtons()}
        </form>
      </div>
    </div>
  }
}
