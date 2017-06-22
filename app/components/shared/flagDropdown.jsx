import React from 'react'
import {connect} from 'react-redux'

const FlagDropdown = React.createClass({
  render() {
    const label = this.props.isLessons ? undefined : (<label className="label">Flag</label>)
    const allFlags = this.props.isLessons ? (<option value="All Flags">All Flags</option>) : undefined
    return (
      <p className="control">
        {label}
        <span className="select">
          <select defaultValue={this.props.flag} onChange={this.props.handleFlagChange}>
          {allFlags}
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