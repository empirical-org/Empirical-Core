import * as React from 'react'
import Datetime from 'react-datetime';
import * as moment from 'moment'

import { copyIcon, } from '../../Shared/index'

const copyImage = <img alt={copyIcon.alt} src={copyIcon.src} />

export const DUE_DATE_DEFAULT_TEXT = 'No due date'
export const PUBLISH_DATE_DEFAULT_TEXT = 'Right away'
export const INVALID_DATES_SNACKBAR_COPY = 'The due date must be after the publish date.'

export const formatDateTimeForDisplay = (datetime) => {
  if (datetime.minutes()) {
    return datetime.format('MMM D, h:mma')
  }
  return datetime.format('MMM D, ha')
}

const CopyToAllButton = ({ handleClickCopyToAll, }) => (
  <button
    className="interactive-wrapper focus-on-light copy-to-all-button"
    onClick={handleClickCopyToAll}
    type="button"
  >
    {copyImage}
    <span>Copy to all</span>
  </button>
)

const DatetimeInput = ({ props, defaultText, }) => {
  const { onClick, value, } = props
  const valueInMoment = value ? moment.utc(value) : null
  const buttonText = valueInMoment ? formatDateTimeForDisplay(valueInMoment) : defaultText
  return (
    <button className="interactive-wrapper focus-on-light datetime-input" onClick={onClick} type="button">
      <span className="text">{buttonText}</span>
      <img alt="dropdown indicator" className="dropdown-indicator" src="https://assets.quill.org/images/icons/dropdown.svg" />
    </button>
  )
}

export const DatePickerContainer = ({ initialValue, defaultText, rowIndex, closeFunction, handleClickCopyToAll, icon, }) => {
  const copyDateToAllButton = rowIndex === 0 ? <CopyToAllButton handleClickCopyToAll={handleClickCopyToAll} /> : ''

  return (
    <div className="date-picker-container">
      <div className="icon-and-datetime-picker">
        {icon}
        <Datetime
          initialValue={initialValue}
          onClose={closeFunction}
          renderInput={(props) => <DatetimeInput defaultText={defaultText} props={props} />}
          utc={true}
        />
      </div>
      {copyDateToAllButton}
    </div>
  )
}
