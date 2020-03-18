import React from 'react';
import PleaseLoginModal from '../please_login_modal.jsx';
import Stripe from '../../modules/stripe/charge.js';

export default React.createClass({

    // TODO: make route for free trial that depends on if they are signed in or not, add stripe integration to free trial

  charge() {
    if (this.props.userIsEligibleForNewSubscription) {
      this.props.showPurchaseModal();
    } else {
      alert('You have an active subscription and cannot buy premium now. If your subscription is a school subscription, you may buy Premium when it expires. If your subscription is a teacher one, please turn on recurring payments and we will renew it automatically when your subscription ends.');
    }
  },

  beginTrialButton() {
    if (this.props.userIsEligibleForTrial || !this.props.userIsSignedIn) {
      return <button className="btn btn-default mini-btn empty-blue" onClick={this.beginTrial} type="button">Free Trial</button>;
    }
  },

  beginTrial() {
    if (!this.props.userIsSignedIn === true) {
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
  },

  pleaseLoginModal() {
    $(this.refs.pleaseLoginModal).modal();
  },

  purchaseButton() {
    if (this.props.userIsSignedIn === true) {
      return <a className="premium-button blue" data-toggle="modal" href="/subscriptions/activate_covid_subscription" id="purchase-btn" type="button">Activate Free Teacher Premium</a>;
    }
    return <button className="premium-button blue" id="purchase-btn" onClick={() => alert('You must be logged in to activate Premium.')} type="button">Activate Free Teacher Premium</button>;
  },

  render() {
    return (
      <div className="pricing-mini">
        <header className="pricing-mini-header blue">
          <div className="img-holder">
            <img alt="teacher_premium_icon" src={`${process.env.CDN_URL}/images/shared/teacher_premium_icon.png`} />
          </div>

          <h4>Teacher Premium</h4>
        </header>
        <section className="pricing-info">
          <div className="premium-rates">
            <h3 className="strikethrough">$80 per year</h3>
            <h4>Free for the rest of the 2019/2020 school year</h4>
          </div>
          <ul className="text-left">
            <li>Everything in Basic</li>
            <li>Reports on concept mastery and Common Core Standards</li>
            <li>Download and print reports</li>
            <li>Priority Support</li>
          </ul>
        </section>
        <div className="row">
          {this.purchaseButton()}
          <PleaseLoginModal ref="pleaseLoginModal" />
        </div>
      </div>
    );
  },
});
