import * as React from 'react'

const MONTHLY = 'Monthly';
const WEEKLY = 'Weekly';
const ON = 'On';
const OFF = 'Off';


const ReportSubscriptionModal = ({ cancel, hasSubscription, existingFrequency, isOpen, save }) => {
  if (!isOpen) return null;

  const [status, setStatus] = React.useState(hasSubscription ? ON : OFF);
  const [showFrequency, setShowFrequency] = React.useState(hasSubscription);
  const [frequency, setFrequency] = React.useState(existingFrequency || MONTHLY);

  function handleStatusOptionChange(e) {
    setStatus(e.target.value)
  }

  function statusRadioOptions() {
    return (
      <div className="radio-options">
        <div className="radio">
          <label id='on-radio-button'>
            <input
              aria-labelledby='blah-on'
              checked={status === ON}
              onChange={handleStatusOptionChange}
              type="radio"
              value={ON}
            />
            On
          </label>
        </div>
        <div className="radio">
          <label id='off-radio-button' />
          <input
            aria-labelledby='blah-of'
            checked={status === OFF}
            onChange={handleStatusOptionChange}
            type="radio"
            value={OFF}
          />
          Off
        </div>
      </div>
    )
  }

  return (
    <div className="manage-report-subscription-modal">
      <div className="title-and-description">
        <h2>Subscribe to this report</h2>
        <p className="description">
          Keep up to date by having this report delivered to your inbox on a recurring basis. It will use filters
          currently applied when you subscribe, so please review them before doing so.  You can always change your
          filters later by turning off the report and re-subscribing.
        </p>
      </div>
      <div className="status-and-frequency">
        <h3 className="label">Email me this report</h3>
        {statusRadioOptions()}
      </div>
    </div>
  );
}

export default ReportSubscriptionModal;
