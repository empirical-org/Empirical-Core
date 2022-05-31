import React from 'react';
import { requestPost } from '../../../../modules/request';

export const StripeSubscriptionCheckoutSessionButton = ({
  buttonClassName,
  buttonId,
  buttonText,
  cancelPath,
  customerEmail,
  schoolId,
  stripePriceId,
  userIsEligibleForNewSubscription,
  userIsSignedIn
}) => {

  const handleClick = () => {
    if (!userIsSignedIn) {
      alert('You must be logged in to activate Premium.')
    } else if (!userIsEligibleForNewSubscription) {
      alert(
        `You have an active subscription and cannot buy premium now. If your subscription is a school subscription,
        you may buy Premium when it expires. If your subscription is a teacher one, please turn on recurring payments
        and we will renew it automatically when your subscription ends.`
      )
    } else {
      const path = '/stripe_integration/subscription_checkout_sessions'
      const data = {
        cancel_path: cancelPath,
        customer_email: customerEmail,
        ...(schoolId && { school_id: schoolId }),
        stripe_price_id: stripePriceId
      }

      requestPost(path, data, body => { window.location.replace(body.redirect_url) })
    }
  }

  return (
    <button
      className={buttonClassName}
      id={buttonId}
      onClick={handleClick}
      type="button"
    >
      {buttonText}
    </button>
  )
}

export default StripeSubscriptionCheckoutSessionButton
