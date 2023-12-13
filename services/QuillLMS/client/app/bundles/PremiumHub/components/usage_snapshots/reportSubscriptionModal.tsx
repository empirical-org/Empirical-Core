import * as React from 'react'

const MONTHLY = 'Monthly';
const WEEKLY = 'Weekly';
const ON = 'On';
const OFF = 'Off';

const ReportSubscriptionModal = ({ cancel, existingFrequency, isOpen, save }) => {
  if (!isOpen) return null;

  const [isSubscribed, setIsSubscribed] = React.useState(existingFrequency ? true : false);
  const [showFrequency, setShowFrequency] = React.useState(existingFrequency ? true : false);
  const [frequency, setFrequency] = React.useState(existingFrequency || MONTHLY);

  function handleIsSubscribedOptionChange(e) {
    setIsSubscribed(e.target.value === ON)
    setShowFrequency(e.target.value === ON)
  }

  function isSubscribedAndFrequency() {
    return (
      <div className="is-subscribed-and-frequency">
        <h3 className="is-subscribed-label">Email me this report</h3>
        <div className="is-subscribed-options">
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
      </div>
    )
  }

  return (
    // <div className="manage-report-subscription-modal">
    <div>
      <div className="title-and-description">
        <h2>Subscribe to this report</h2>
        <p className="description">
          Keep up to date by having this report delivered to your inbox on a recurring basis. It will use filters
          currently applied when you subscribe, so please review them before doing so.  You can always change your
          filters later by turning off the report and re-subscribing.
        </p>
      </div>
      {isSubscribedAndFrequency()}
    </div>
  );
}

export default ReportSubscriptionModal;
