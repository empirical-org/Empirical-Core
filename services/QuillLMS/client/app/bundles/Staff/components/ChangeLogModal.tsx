import React from 'react'
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

export default class ChangeLogModal extends React.Component {
  constructor(props) {
    super(props)

    const stateObj = {}
    props.changedFields.forEach((field, i) => {
      stateObj[`changeLog${i}`] = {
        action: field,
        explanation: '',
        conceptID: props.conceptID
      }
    })

    this.state = stateObj
  }

  render() {
    return <div className="change-log-modal-container">
      <div className="modal-background" />
      <div className={`modal change-log-modal`}>
      BOO
      </div>
    </div>
  }
}
