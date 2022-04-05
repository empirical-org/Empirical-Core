import React from 'react';
import request from 'request';
import getAuthToken from '../modules/get_auth_token'

export const StripeCheckoutSessionButton = ({
  buttonClassName,
  buttonId,
  buttonText,
  customerEmail,
  stripePlan,
  userIsEligibleForNewSubscription,
  userIsSignedIn
}) => {

  const handleClick = () => {
    const { plan } = stripePlan

    if (!userIsSignedIn) {
      alert('You must be logged in to activate Premium.')
    } else if (!userIsEligibleForNewSubscription) {
      alert(
        `You have an active subscription and cannot buy premium now. If your subscription is a school subscription,
        you may buy Premium when it expires. If your subscription is a teacher one, please turn on recurring payments
        and we will renew it automatically when your subscription ends.`
      )
    } else {
      request.post({
        url: `${process.env.DEFAULT_URL}/stripe_integration/checkout_sessions`,
        form: {
          authenticity_token: getAuthToken(),
          customer_email: customerEmail,
          stripe_price_id: plan.stripe_price_id
        }
      }, (error, response, body) => {
        if (error) { throw Error(response.statusText) }

        window.location.replace(JSON.parse(body).redirect_url)
      })
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

export default StripeCheckoutSessionButton
