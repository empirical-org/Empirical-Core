import * as React from 'react'

const FlagDropdown = (props) => {
  const label = props.isLessons ? undefined : (<label className="label">Flag</label>)
  const allFlags = props.isLessons ? (<option value="All Flags">All Flags</option>) : undefined
  return (
    <p className="control">
      {label}
      <span className="select">
        <select defaultValue={props.flag} onChange={props.handleFlagChange}>
          {allFlags}
          <option value="alpha">alpha</option>
          <option value="beta">beta</option>
          <option value="gamma">gamma</option>
          <option value="production">production</option>
          <option value="archived">archived</option>
          <option value="private">private</option>
        </select>
      </span>
    </p>
  )
}

export { FlagDropdown }
