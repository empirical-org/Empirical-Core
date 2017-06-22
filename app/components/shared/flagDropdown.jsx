import React from 'react'
import {connect} from 'react-redux'

const FlagDropdown = React.createClass({
  render() {
    return (
      <p className="control">
        <label className="label">Flag</label>
        <span className="select">
          <select defaultValue={this.props.flag} onChange={this.props.handleFlagChange}>
          <option value="Alpha">Alpha</option>
          <option value="Beta">Beta</option>
          <option value="Production">Production</option>
          <option value="Archive">Archive</option>
          </select>
        </span>
      </p>
    )
  }
})

export default connect()(FlagDropdown)