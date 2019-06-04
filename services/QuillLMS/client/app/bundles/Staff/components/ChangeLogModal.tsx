import React from 'react'
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Input, DropdownInput } from 'quill-component-library/dist/componentLibrary'

const fieldToActionNameMap = {
  'name': 'Renamed'
}

export default class ChangeLogModal extends React.Component {
  constructor(props) {
    super(props)

    const stateObj = {}
    props.changedFields.forEach((field, i) => {
      stateObj[`changeLog${i}`] = {
        action: this.fieldToActionNameMap()[field],
        explanation: '',
        conceptID: props.conceptID
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
    this.setState({[key]: e.target.value})
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

  render() {
    return <div className="change-log-modal-container">
      <div className="modal-background" />
      <div className={`modal change-log-modal`}>
        <h1>Describe what action you took and why.</h1>
        <p>Be as specific as possible. For example, if you rename a concept, include the concept's original name in the description. If you archive a concept because it was a duplicate, include the UID of the concept being retained.</p>
        {this.renderChangeLogFields()}
      </div>
    </div>
  }
}
