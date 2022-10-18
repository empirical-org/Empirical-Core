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
  return (
    <span className="interactive-wrapper focus-on-light datetime-input">
      <input {...props} placeholder={defaultText} />
      <img alt="dropdown indicator" className="dropdown-indicator" src="https://assets.quill.org/images/icons/dropdown.svg" />
    </span>
  )
}

export const DatePickerContainer = ({ initialValue, defaultText, closeFunction, handleClickCopyToAll, icon, showCopyToAll, }) => {
  const copyDateToAllButton = showCopyToAll ? <CopyToAllButton handleClickCopyToAll={handleClickCopyToAll} /> : ''

  return (
    <div className="date-picker-container">
      <div className="icon-and-datetime-picker">
        {icon}
        <Datetime
          dateFormat="MMM D"
          initialValue={initialValue}
          onClose={closeFunction}
          renderInput={(props) => <DatetimeInput defaultText={defaultText} props={props} />}
          timeFormat="h:mm a"
          utc={true}
        />
      </div>
      {copyDateToAllButton}
    </div>
  )
}
