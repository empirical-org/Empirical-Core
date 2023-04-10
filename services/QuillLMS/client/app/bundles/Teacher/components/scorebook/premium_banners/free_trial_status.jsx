import * as React from 'react';

const FreeTrialStatus = ({ status, originPage, upgradeToPremiumNowButton, lastSubscriptionWasTrial, data, }) => {
  const stateSpecificComponents = () => {
    if (status == 'trial') {
      return <h4>You have {data} days left in your trial.</h4>
    } else if (status == 'locked') {
      return <h4>Your Premium {lastSubscriptionWasTrial ? 'Trial' : 'Subscription'} Has Expired</h4>
    }
  };

  const premiumButton = (originPage === 'premium')
    ? upgradeToPremiumNowButton()
    : <a href='/premium'><button className='btn-orange' type='button'>Upgrade to Premium Now</button></a>

  return (
    <div className='row'>
      <div className='col-md-9 col-xs-12 pull-left'>
        {stateSpecificComponents()}
        <span>Getting value out of Premium? <a href='/premium'>Check out our pricing plans.</a></span>
      </div>
      <div className='col-md-3 col-xs-12 pull-right'>
        <div className='premium-button-box text-center'>
          {premiumButton}
        </div>
      </div>
    </div>
  );
}

export default FreeTrialStatus
