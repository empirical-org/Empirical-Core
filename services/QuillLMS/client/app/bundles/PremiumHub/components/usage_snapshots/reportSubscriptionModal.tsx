import * as React from 'react'

import { DropdownInput } from '../../../Shared/index';

const MONTHLY = 'Monthly';
const WEEKLY = 'Weekly';
const ON = 'On';
const OFF = 'Off';

const ReportSubscriptionModal = ({ cancel, existingFrequency, isOpen, save }) => {
  if (!isOpen) return null;

  const [isSubscribed, setIsSubscribed] = React.useState(existingFrequency ? true : false);
  const [frequency, setFrequency] = React.useState(existingFrequency || MONTHLY);

  const frequencyOptions = [{ "value": MONTHLY, "label": MONTHLY }, { "value": WEEKLY, "label": WEEKLY }]

  const handleIsSubscribedOptionChange = (option: { target: { value: string } }) => {
    setIsSubscribed(option.target.value === ON)
  }

  const handleFrequencyOptionChange = (e: { value: string }) => {
    debugger
    setFrequency(e.value)
  }

  function showTitleAndDescription() {
    return (
      <div className="title-and-description">
        <h2>Subscribe to this report</h2>
        <p className="description">
          Keep up to date by having this report delivered to your inbox on a recurring basis. It will use filters
          currently applied when you subscribe, so please review them before doing so.  You can always change your
          filters later by turning off the report and re-subscribing.
        </p>
      </div>
    )
  }

  function showIsSubscribedAndFrequency() {
    return (
      <div className="is-subscribed-and-frequency">
        {showIsSubscribedOptions()}
        {showFrequencyOptions()}
      </div>
    )
  }

  function showIsSubscribedOptions() {
    return (
      <div className="is-subscribed-options.">
        <h3 className="is-subscribed-label">Email me this report</h3>
        <div className="radio">
          <label id='is-subscribed-on-button'>
            <input
              aria-labelledby='is-subscribed-on-button'
              checked={isSubscribed}
              onChange={handleIsSubscribedOptionChange}
              type="radio"
              value={ON}
            />
            On
          </label>
        </div>
        <div className="radio">
          <label id='is-subscribed-off-button'>
            <input
              aria-labelledby='is-subscribed-off-button'
              checked={!isSubscribed}
              onChange={handleIsSubscribedOptionChange}
              type="radio"
              value={OFF}
            />
            Off
          </label>
        </div>
      </div >
    )
  }

  function showFrequencyOptions() {
    const selectedFrequency = frequencyOptions.find(option => frequency === option.value)

    return (
      <DropdownInput
        className={`frequency-options ${isSubscribed ? '' : 'disabled'}`}
        disabled={!isSubscribed}
        handleChange={handleFrequencyOptionChange}
        isSearchable={false}
        label="Frequency"
        options={frequencyOptions}
        value={selectedFrequency}
      />
    )
  }

  function showSaveAndCancelButtons() {
    return (
      <div className="save-and-cancel-buttons">
        <button
          className="quill-button medium secondary outlined focus-on-light"
          onClick={cancel}
          type="button"
        >
          Cancel
        </button>
        <button
          className="quill-button medium primary contained focus-on-light"
          onClick={save}
          type="button"
        >
          Save
        </button>
      </div>
    )
  }

  return (
    <div className="manage-report-subscription-modal">
      <div>
        {showTitleAndDescription()}
        {showIsSubscribedAndFrequency()}
        {showSaveAndCancelButtons()}
      </div>
    </div>
  );
}

export default ReportSubscriptionModal;
