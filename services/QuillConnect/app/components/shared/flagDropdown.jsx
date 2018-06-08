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
          <option value="alpha">alpha</option>
          <option value="beta">beta</option>
          <option value="production">production</option>
          <option value="archived">archived</option>
          </select>
        </span>
      </p>
    )
  }
})

export default connect()(FlagDropdown)
