import pluralize from 'pluralize';
import React from 'react';

const AvailableCredits = ({ userHasValidSub, redeemPremiumCredits, availableCredits, }) => {
  const redeemIfNoCurrentSub = () => {
    if (userHasValidSub) {
      alert('You cannot redeem credits while you have a valid subscription. You must wait until your current subscription has expired to redeem them.');
    } else {
      redeemPremiumCredits();
    }
  };

  let button;
  if (availableCredits > 0) {
    button = <button className="quill-button-archived medium primary outlined focus-on-light" onClick={redeemIfNoCurrentSub} type="button">Redeem Premium Credits</button>;
  } else {
    button = <a className="quill-button-archived medium primary outlined focus-on-light" href="/referrals">Earn premium credits</a>;
  }
  const weeksOfCredit = Math.round(availableCredits / 7)
  const whiteIfNoCredit = weeksOfCredit === 0 ? 'no-credits' : null;
  return (
    <div className={`${whiteIfNoCredit} available-credit flex-row vertically-centered space-between`}>
      <div className="credit-quantity">
        You have <span>{`${weeksOfCredit} ${pluralize('week', weeksOfCredit)} `}</span> of Teacher Premium Credit available.
      </div>
      {button}
    </div>
  );
}

export default AvailableCredits
