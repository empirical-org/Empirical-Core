import React from 'react';
import request from 'request';

import IndividualFeaturesTable from './individual_features_table'
import getAuthToken from '../../modules/get_auth_token';

export default class TeacherPricingMini extends React.Component {
  handleBuyNow = () => {
    const {
      customerEmail,
      stripeCustomerId,
      stripeTeacherPlan,
      userIsEligibleForNewSubscription,
      userIsSignedIn,
    } = this.props

    if (!userIsSignedIn) {
      alert('You must be logged in to activate Premium.')
    } else if (userIsEligibleForNewSubscription) {
      request.post({
        url: `${process.env.DEFAULT_URL}/stripe_integration/checkout_sessions`,
        form: {
          authenticity_token: getAuthToken(),
          customer: stripeCustomerId,
          customer_email: customerEmail,
          price_id: stripeTeacherPlan.stripe_price_id
        }
      }, (error, _httpStatus, body) => {
        if (error) {
          console.error('error', error
        } else {
          window.location.replace(JSON.parse(body).redirect_url)
        }
      })
    } else {
      alert(
        `You have an active subscription and cannot buy premium now. If your subscription is a school subscription,
        you may buy Premium when it expires. If your subscription is a teacher one, please turn on recurring payments
        and we will renew it automatically when your subscription ends.`
      )
    }
  };

  buyNowButton = () => {
    return (
      <button
        className="quill-button contained medium primary focus-on-light"
        id="purchase-btn"
        onClick={this.handleBuyNow}
        type="button"
      >
        Buy now
      </button>
    )
  };

  render() {
    const { premiumFeatureData, stripeTeacherPlan } = this.props

    return (
      <div className="pricing-mini">
        <section className="pricing-info">
          <h2>{stripeTeacherPlan.display_name}</h2>
          <div className="premium-rates">
            <h3>${stripeTeacherPlan.price_in_dollars}</h3>
            <p>Per teacher, per year</p>
          </div>
          <div className="premium-button-container">
            {this.buyNowButton()}
          </div>
        </section>

        <IndividualFeaturesTable
          premiumFeatureData={premiumFeatureData}
          type="teacher"
        />
      </div>
    );
  }
}
