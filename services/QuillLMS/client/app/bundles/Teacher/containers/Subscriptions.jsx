import React from 'react';
import request from 'request';
import _ from 'lodash';

import SubscriptionStatus from '../components/subscriptions/SubscriptionStatus';
import AvailableCredits from '../components/subscriptions/available_credits';
import CurrentSubscription from '../components/subscriptions/current_subscription';
import SubscriptionHistory from '../components/subscriptions/subscription_history';
import PremiumConfirmationModal from '../components/subscriptions/premium_confirmation_modal';
import RefundPolicy from '../components/subscriptions/refund_policy';
import PremiumCreditsTable from '../components/subscriptions/premium_credits_table';
import getAuthToken from '../components/modules/get_auth_token';
import { ACCOUNT_TYPE_TO_SUBSCRIPTION_TYPES } from '../components/subscriptions/constants';

export default class Subscriptions extends React.Component {
  constructor(props) {
    super(props);
    const availableAndEarnedCredits = this.availableAndEarnedCredits();

    this.state = {
      subscriptions: props.subscriptions,
      subscriptionStatus: props.subscriptionStatus,
      availableCredits: availableAndEarnedCredits.available,
      earnedCredits: availableAndEarnedCredits.earned,
      authorityLevel: props.userAuthorityLevel,
    };
  }

  availableAndEarnedCredits() {
    const { premiumCredits, } = this.props

    let earned = 0;
    let spent = 0;

    premiumCredits.forEach((c) => {
      if (c.amount > 0) {
        earned += c.amount;
      } else {
        spent -= c.amount;
      }
    });
    return { earned, available: earned - spent, };
  }

  currentSubscription(newSub) {
    const { subscriptionStatus, } = this.state

    if (!subscriptionStatus || subscriptionStatus.expired) {
      return newSub;
    }
    return subscriptionStatus;
  }

  purchaserNameOrEmail() {
    const { subscriptionStatus, } = this.state

    if (!subscriptionStatus) { return }

    return subscriptionStatus.purchaser_name || subscriptionStatus.purchaser_email
  }

  redeemPremiumCredits = () => {
    const { subscriptions, } = this.state
    request.put({
      url: `${process.env.DEFAULT_URL}/credit_transactions/redeem_credits_for_premium`,
      json: {
        authenticity_token: getAuthToken(),
      },
    }, (error, httpStatus, body) => {
      if (body.error) {
        alert(body.error);
      } else {
        this.setState({
          subscriptions: [body.subscription].concat(subscriptions),
          subscriptionStatus: this.currentSubscription(body.subscription),
          availableCredits: 0,
          showPremiumConfirmationModal: true,
        });
      }
    });
  };

  subscriptionType() {
    const { subscriptionStatus } = this.props

    if (!subscriptionStatus) { return 'Basic' }

    return ACCOUNT_TYPE_TO_SUBSCRIPTION_TYPES[subscriptionStatus.account_type]
  }

  updateCard = () => {
  };

  updateSubscription = (params, subscriptionId) => {
    request.put({
      url: `${process.env.DEFAULT_URL}/subscriptions/${subscriptionId}`,
      json: { subscription: params, authenticity_token: getAuthToken(), },
    }, (error, httpStatus, body) => {
      if (httpStatus.statusCode === 200) {
        location.reload();
      } else {
        alert('There was an error updating your subscription. Please try again or contact hello@quill.org.');
      }
    });
  };

  updateSubscriptionStatus = subscription => {
    this.setState({ subscriptionStatus: subscription, showPremiumConfirmationModal: true, showPurchaseModal: false, });
  };

  userIsContact() {
    const { subscriptionStatus, } = this.props
    if (subscriptionStatus) {
      return Number(document.getElementById('current-user-id').getAttribute('content')) === subscriptionStatus.purchaser_id;
    }
    return false;
  }

  render() {
    const { lastFour, premiumCredits, subscriptionPurchasedToday, stripeTeacherPlan } = this.props
    const { subscriptionStatus, authorityLevel, availableCredits, earnedCredits, subscriptions, } = this.state

    const userHasValidSub = subscriptionStatus && !subscriptionStatus.expired;
    const subId = `${_.get(subscriptionStatus, 'id')}-subscription-status-id`;

    // don't show any last four unless they have an authority level with their purchase, or they don't have a sub
    const lastFourToPass = (authorityLevel || !subscriptionStatus) ? lastFour : null;

    return (
      <div>
        <SubscriptionStatus
          key={subId}
          stripeTeacherPlan={stripeTeacherPlan}
          subscriptionStatus={subscriptionStatus}
          subscriptionType={this.subscriptionType()}
          userIsContact={this.userIsContact()}
        />
        <CurrentSubscription
          authorityLevel={authorityLevel}
          lastFour={lastFourToPass}
          purchaserNameOrEmail={this.purchaserNameOrEmail()}
          subscriptionStatus={subscriptionStatus}
          subscriptionType={this.subscriptionType()}
          updateSubscription={this.updateSubscription}
          userIsContact={this.userIsContact()}
        />
        <SubscriptionHistory
          authorityLevel={authorityLevel}
          premiumCredits={premiumCredits}
          subscriptions={subscriptions}
        />
        <AvailableCredits
          availableCredits={availableCredits}
          redeemPremiumCredits={this.redeemPremiumCredits}
          userHasValidSub={userHasValidSub}
        />
        <PremiumCreditsTable
          earnedCredits={earnedCredits}
          premiumCredits={premiumCredits}
        />
        <RefundPolicy />
        <PremiumConfirmationModal subscription={subscriptionPurchasedToday} />
      </div>
    )
  }
}
