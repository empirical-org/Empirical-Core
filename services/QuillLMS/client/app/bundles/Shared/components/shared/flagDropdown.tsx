import * as React from 'react'
import { flagOptions } from '../../../../constants/evidence'

const flagOptionList = () => {
  return ( flagOptions.map((flagOption) => (
    <option value={flagOption.value}>{flagOption.label}</option>
  )) )
}
const FlagDropdown = (props) => {
  const label = props.isLessons ? undefined : (<label className="label">Flag</label>)
  const allFlags = props.isLessons ? (<option value="All Flags">All Flags</option>) : undefined
  return (
    <p className="control">
      {label}
      <span className="select">
        <select defaultValue={props.flag} onChange={props.handleFlagChange}>
          {allFlags}
          {flagOptionList()}
        </select>
      </span>
    </p>
  )
}

export { FlagDropdown }
