import React from 'react';
import PleaseLoginModal from '../please_login_modal.jsx';
import Stripe from '../../modules/stripe/charge.js';

export default class TeacherPricingMini extends React.Component {
  // TODO: make route for free trial that depends on if they are signed in or not, add stripe integration to free trial

  handleClickGetStarted = () => {
    const { userIsEligibleForNewSubscription, showPurchaseModal, userIsSignedIn, } = this.props
    if (!userIsSignedIn) {
      alert('You must be logged in to activate Premium.')
    } else if (userIsEligibleForNewSubscription) {
      showPurchaseModal();
    } else {
      alert('You have an active subscription and cannot buy premium now. If your subscription is a school subscription, you may buy Premium when it expires. If your subscription is a teacher one, please turn on recurring payments and we will renew it automatically when your subscription ends.');
    }
  };

  beginTrialButton = () => {
    const { userIsEligibleForTrial, userIsSignedIn, } = this.props

    if (userIsEligibleForTrial || !userIsSignedIn) {
      return <button className="quill-button medium secondary outlined focus-on-light" onClick={this.handleClickStartTrial} type="button">Start free trial</button>;
    }
  };

  handleClickStartTrial = () => {
    const { userIsSignedIn, } = this.props
    if (!userIsSignedIn) {
      alert('You must be logged in to activate Premium.');
    } else {
      $.post('/subscriptions', {
        subscription: {
          account_type: 'Teacher Trial'
        },
        authenticity_token: $('meta[name=csrf-token]').attr('content')
      }).done(() => {
        window.location.assign('/teachers/progress_reports/activities_scores_by_classroom');
      });
    }
  };

  pleaseLoginModal = () => {
    $(this.refs.pleaseLoginModal).modal();
  };

  purchaseButton = () => {
    return <button className="quill-button contained medium primary focus-on-light" id="purchase-btn" onClick={this.handleClickGetStarted} type="button">Buy now</button>;
  };

  render() {
    return (
      <div className="pricing-mini">
        <section className="pricing-info">
          <h2>Teacher Premium</h2>
          <div className="premium-rates">
            <h3>$80</h3>
            <p>Per year</p>
          </div>
          <div className="premium-button-container">
            {this.beginTrialButton()}
            {this.purchaseButton()}
          </div>
        </section>
      </div>
    );
  }
}
