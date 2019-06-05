import React from 'react'
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Input, DropdownInput } from 'quill-component-library/dist/componentLibrary'

import { Concept } from '../interfaces/interfaces'

interface ChangeLogModalProps {
  changedFields: Array<string>;
  cancel: Function;
  save: Function;
  concept: Concept;
}

interface ChangeLogModalState {
  [key:string]: { action: string, explanation: string, conceptID: string|number }
}

export default class ChangeLogModal extends React.Component<ChangeLogModalProps, ChangeLogModalState> {
  constructor(props) {
    super(props)

    const stateObj = {}
    props.changedFields.forEach((field, i) => {
      stateObj[`changeLog${i}`] = {
        action: this.fieldToActionNameMap()[field],
        explanation: '',
        conceptID: props.concept.id
      }
    })

    this.state = stateObj

    this.updateExplanation = this.updateExplanation.bind(this)
  }

  fieldToActionNameMap() {
    const { levelNumber, concept, } = this.props
    return {
      name: `Renaming Level ${levelNumber}`,
      parent: `Changing Level ${levelNumber + 1}`,
      description: 'Changing Rule Description',
      visible: concept.visible ? 'Unarchiving' : 'Archiving'
    }
  }

  updateExplanation(key, e) {
    const changeLog = this.state[key]
    changeLog.explanation = e.target.value
    this.setState({ [key]: changeLog })
  }

  renderChangeLogFields() {
    return Object.keys(this.state).map(key => {
      return <Input
        label={`Action Explanation: ${this.state[key].action}`}
        value={this.state[key].explanation}
        type='text'
        id={key}
        className="multi-line"
        handleChange={(e) => {this.updateExplanation(key, e)}}
      />
    })
  }

  renderButtons() {
    const { save, cancel, } = this.props
    let saveButtonClass = 'quill-button contained primary medium';
    const allChangesEntered = Object.keys(this.state).every(key => this.state[key].explanation.length)
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
        {this.renderChangeLogFields()}
        {this.renderButtons()}
      </div>
    </div>
  }
}
