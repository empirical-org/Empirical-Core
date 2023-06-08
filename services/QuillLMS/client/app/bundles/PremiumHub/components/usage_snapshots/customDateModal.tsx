import * as React from 'react'
import "react-dates/initialize";
import { DateRangePicker } from 'react-dates';

import useWindowSize from '../../../Shared/hooks/useWindowSize';

const MAX_VIEW_WIDTH_FOR_MOBILE = 600

const rightArrowImg = <img alt="" src={`${process.env.CDN_URL}/images/pages/administrator/right_arrow.svg`} />
const leftArrowImg = <img alt="" src={`${process.env.CDN_URL}/images/pages/administrator/left_arrow.svg`} />

const CustomDateModal = ({ close, passedStartDate, setCustomDates, passedEndDate, }) => {
  const [focusedInput, setFocusedInput] = React.useState("startDate")
  const [startDate, setStartDate] = React.useState(passedStartDate)
  const [endDate, setEndDate] = React.useState(passedEndDate)

  const size = useWindowSize();

  function handleDateChange(newDates) {
    setStartDate(newDates.startDate)
    setEndDate(newDates.endDate)
  }

  function handleClickApply() {
    setCustomDates(startDate, endDate)
  }

  function handleSetFocusedInput(newFocusedInput) {
    if (!newFocusedInput) { return }

    setFocusedInput(newFocusedInput)
  }

  function isOutsideRange() { return false }

  let applyClassName = "quill-button medium primary contained focus-on-light"

  applyClassName += startDate && endDate ? '' : ' disabled'

  // disabling autofocus lint here as it is a) necessary to get the calendar to stay open at all times and b) presents less of an accessibility issue because we do in fact want users to be focused into this modal when it appears
  /* eslint-disable jsx-a11y/no-autofocus */
  return (
    <div className="modal-container custom-date-modal-container">
      <div className="modal-background" />
      <div className="custom-date-modal quill-modal modal-body">
        <h2>Select custom date range</h2>
        <DateRangePicker
          autoFocus={true}
          endDate={endDate}
          focusedInput={focusedInput}
          isOutsideRange={isOutsideRange}
          navNext={rightArrowImg}
          navPrev={leftArrowImg}
          numberOfMonths={size.width <= MAX_VIEW_WIDTH_FOR_MOBILE ? 1 : 2}
          onDatesChange={handleDateChange}
          onFocusChange={handleSetFocusedInput}
          startDate={startDate}
        />
        <div className="button-section">
          <button className="quill-button medium secondary outlined focus-on-light" onClick={close} type="button">Cancel</button>
          <button className={applyClassName} disabled={!(startDate && endDate)} onClick={handleClickApply} type="button">Apply</button>
        </div>
      </div>
    </div>
  )
  /* eslint-enable jsx-a11y/no-autofocus */
}

export default CustomDateModal
