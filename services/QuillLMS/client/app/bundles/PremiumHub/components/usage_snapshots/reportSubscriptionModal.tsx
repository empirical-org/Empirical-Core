import * as React from 'react'

import { DropdownInput } from '../../../Shared/index';

const MONTHLY = 'Monthly';
const WEEKLY = 'Weekly';
const ON = 'On';
const OFF = 'Off';

const ReportSubscriptionModal = ({ cancel, currentPdfSubscription, isOpen, save }) => {
  if (!isOpen) return null;

  const [isSubscribed, setIsSubscribed] = React.useState(currentPdfSubscription ? true : false);
  const [frequency, setFrequency] = React.useState(currentPdfSubscription?.frequency || MONTHLY);

  const frequencyOptions = [{ "value": MONTHLY, "label": MONTHLY }, { "value": WEEKLY, "label": WEEKLY }]

  const handleFrequencyOptionChange = (e: { value: string }) => {
    setFrequency(e.value)
  }

  const handleIsSubscribedOptionChange = (option: { target: { value: string } }) => {
    setIsSubscribed(option.target.value === ON)
  }

  function handleSaveClick() { save(isSubscribed, frequency, currentPdfSubscription) }

  function renderFrequencyOptions() {
    const selectedFrequency = frequencyOptions.find(option => frequency === option.value)

    return (
      <div className="frequency-options">
        <label className="frequency-label" htmlFor="frequency">
          <span>Frequency</span>
        </label>
        <DropdownInput
          className={isSubscribed ? '' : 'disabled'}
          disabled={!isSubscribed}
          handleChange={handleFrequencyOptionChange}
          isSearchable={false}
          label=""
          options={frequencyOptions}
          value={selectedFrequency}
        />
      </div>
    )
  }

  function renderIsSubscribedOptions() {
    return (
      <div className="is-subscribed-options">
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

  function renderIsSubscribedAndFrequency() {
    return (
      <div className="is-subscribed-and-frequency">
        {renderIsSubscribedOptions()}
        {renderFrequencyOptions()}
      </div>
    )
  }

  function renderSaveAndCancelButtons() {
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
          onClick={handleSaveClick}
          type="button"
        >
          Save
        </button>
      </div>
    )
  }

  function renderTitleAndDescription() {
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

  return (
    <div className="modal-container">
      <div className="modal-background" />
      <div className="manage-report-subscription-modal quill-modal modal-body">
        <div>
          {renderTitleAndDescription()}
          {renderIsSubscribedAndFrequency()}
          {renderSaveAndCancelButtons()}
        </div>
      </div>
    </div>
  );
}

export default ReportSubscriptionModal;
