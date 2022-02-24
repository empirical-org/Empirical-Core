import React from 'react';
import moment from 'moment';
import pluralize from 'pluralize';

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
    button = <button className="q-button cta-button bg-orange has-credit" onClick={redeemIfNoCurrentSub} type="button">Redeem Premium Credits</button>;
  } else {
    button = <a className="q-button button cta-button bg-orange" href="/referrals">Earn Premium Credits</a>;
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
