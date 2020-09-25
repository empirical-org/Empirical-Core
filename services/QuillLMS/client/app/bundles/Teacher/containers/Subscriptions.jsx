import React from 'react';
import request from 'request';
import _ from 'lodash';

import PurchaseModal from './PurchaseModal';

import SubscriptionStatus from '../components/subscriptions/subscription_status';
import AvailableCredits from '../components/subscriptions/available_credits';
import CurrentSubscription from '../components/subscriptions/current_subscription';
import SubscriptionHistory from '../components/subscriptions/subscription_history';
import PremiumConfirmationModal from '../components/subscriptions/premium_confirmation_modal';
import RefundPolicy from '../components/subscriptions/refund_policy';
import PremiumCreditsTable from '../components/subscriptions/premium_credits_table';
import getAuthToken from '../components/modules/get_auth_token';

export default class extends React.Component {
  constructor(props) {
    super(props);
    const availableAndEarnedCredits = this.availableAndEarnedCredits();
    this.state = {
      subscriptions: this.props.subscriptions,
      subscriptionStatus: this.props.subscriptionStatus,
      availableCredits: availableAndEarnedCredits.available,
      earnedCredits: availableAndEarnedCredits.earned,
      showPremiumConfirmationModal: false,
      showPurchaseModal: false,
      purchaserNameOrEmail: this.purchaserNameOrEmail(),
      authorityLevel: this.props.userAuthorityLevel,
    };
  }

  getPurchaserName() {
    const that = this;
    const idPath = 'subscriptionStatus.id';
    const subId = _.get(that.state, idPath) || _.get(that.props, idPath);
    request.get({
      url: `${process.env.DEFAULT_URL}/subscriptions/${subId}/purchaser_name`,
    },
    (e, r, body) => {
      that.setState({ purchaserNameOrEmail: JSON.parse(body).name, });
    });
  }

  availableAndEarnedCredits() {
    let earned = 0;
    let spent = 0;
    this.props.premiumCredits.forEach((c) => {
      if (c.amount > 0) {
        earned += c.amount;
      } else {
        spent -= c.amount;
      }
    });
    return { earned, available: earned - spent, };
  }

  currentSubscription(newSub) {
    if (!this.state.subscriptionStatus || this.state.subscriptionStatus.expired) {
      return newSub;
    }
    return this.state.subscriptionStatus;
  }

  hidePremiumConfirmationModal = () => {
    this.setState({ showPremiumConfirmationModal: false, });
  };

  hidePurchaseModal = () => {
    this.setState({ showPurchaseModal: false, });
  };

  purchasePremiumButton() {
    return <button className="q-button button cta-button bg-orange text-white" data-toggle="modal" id="purchase-btn" onClick={this.purchasePremium} type="button">Update Card</button>;
  }

  purchaserNameOrEmail() {
    const sub = (this.state && this.state.subscriptionStatus) || this.props.subscriptionStatus;
    if (sub) {
      if (!sub.purchaser_id) {
        this.setState({ purchaserNameOrEmail: sub.user_email ? sub.user_email : 'Not Recorded', });
      } else {
        this.getPurchaserName();
      }
    } else {
      this.setState({ purchaserNameOrEmail: 'N/A', });
    }
  }

  redeemPremiumCredits = () => {
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
          subscriptions: [body.subscription].concat(this.state.subscriptions),
          subscriptionStatus: this.currentSubscription(body.subscription),
          availableCredits: 0,
          showPremiumConfirmationModal: true,
        });
      }
    });
  };

  showPremiumConfirmationModal = () => {
    this.setState({ showPremiumConfirmationModal: true, });
  };

  showPurchaseModal = () => {
    this.setState({ showPurchaseModal: true, });
  };

  subscriptionType() {
    if (!this.props.subscriptionStatus) {
      return 'Basic';
    }
    const accountType = this.props.subscriptionStatus.account_type;
    if (this.props.schoolSubscriptionTypes === 'School Sponsored') {
      return 'School Sponsored';
    }
    if (this.props.schoolSubscriptionTypes.includes(accountType)) {
      return 'School';
    } else if (this.props.trialSubscriptionTypes.includes(accountType)) {
      return 'Trial';
    }
    return 'Teacher';
  }

  updateCard = () => {
    this.showPurchaseModal();
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
    if (this.props.subscriptionStatus) {
      return Number(document.getElementById('current-user-id').getAttribute('content')) === this.props.subscriptionStatus.purchaser_id;
    }
    return false;
  }

  render() {
    const userHasValidSub = this.state.subscriptionStatus && !this.state.subscriptionStatus.expired;
    const subId = `${_.get(this.state.subscriptionStatus, 'subscriptionStatus.id')}-subscription-status-id`;
    // don't show any last four unless they have an authority level with their purchase, or they don't have a sub
    const lastFour = (this.state.authorityLevel || !this.state.subscriptionStatus) ? this.props.lastFour : null;
    return (
      <div>
        <SubscriptionStatus
          key={subId}
          showPurchaseModal={this.showPurchaseModal}
          subscriptionStatus={this.state.subscriptionStatus}
          subscriptionType={this.subscriptionType()}
          userIsContact={this.userIsContact()}
        />
        <CurrentSubscription
          authorityLevel={this.state.authorityLevel}
          lastFour={lastFour}
          purchaserNameOrEmail={this.state.purchaserNameOrEmail}
          showPurchaseModal={this.showPurchaseModal}
          subscriptionStatus={this.state.subscriptionStatus}
          subscriptionType={this.subscriptionType()}
          updateSubscription={this.updateSubscription}
          userIsContact={this.userIsContact()}
        />
        <SubscriptionHistory
          authorityLevel={this.state.authorityLevel}
          premiumCredits={this.props.premiumCredits}
          subscriptions={this.state.subscriptions}
        />
        <AvailableCredits availableCredits={this.state.availableCredits} redeemPremiumCredits={this.redeemPremiumCredits} userHasValidSub={userHasValidSub} />
        <PremiumCreditsTable
          earnedCredits={this.state.earnedCredits}
          premiumCredits={this.props.premiumCredits}
        />
        <RefundPolicy />
        <PremiumConfirmationModal
          hideModal={this.hidePremiumConfirmationModal}
          show={this.state.showPremiumConfirmationModal}
          subscription={this.state.subscriptionStatus}
        />
        <PurchaseModal
          hideModal={this.hidePurchaseModal}
          lastFour={lastFour}
          show={this.state.showPurchaseModal}
          subscriptionType={this.subscriptionType()}
          updateSubscriptionStatus={this.updateSubscriptionStatus}
        />
      </div>
    );
  }
}


