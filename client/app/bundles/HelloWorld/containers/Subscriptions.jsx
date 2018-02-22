import React from 'react';
import request from 'request';
import _ from 'lodash';
import moment from 'moment';
import pluralize from 'pluralize';
import SubscriptionStatus from '../components/subscriptions/subscription_status';
import PaymentModal from '../components/subscriptions/select_credit_card_modal';
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
    };
    this.redeemPremiumCredits = this.redeemPremiumCredits.bind(this);
    this.showPremiumConfirmationModal = this.showPremiumConfirmationModal.bind(this);
    this.showPaymentModal = this.showPaymentModal.bind(this);
    this.hidePremiumConfirmationModal = this.hidePremiumConfirmationModal.bind(this);
    this.hidePaymentModal = this.hidePaymentModal.bind(this);
    this.updateSubscriptionStatus = this.updateSubscriptionStatus.bind(this);
    this.updateCard = this.updateCard.bind(this);
    this.updateSubscription = this.updateSubscription.bind(this);
    this.currentUserIsPurchaser = this.currentUserIsPurchaser.bind(this);
  }

  updateSubscriptionStatus(subscription) {
    this.setState({ subscriptionStatus: subscription, showPremiumConfirmationModal: true, showPurchaseModal: false, });
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

  currentUserIsPurchaser(subscription) {
    const currentUserId = document.getElementById('current-user-id').getAttribute('content');
    return _.get(subscription, 'purchaser_id') === Number(currentUserId);
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

  purchasePremiumButton() {
    return <button type="button" id="purchase-btn" data-toggle="modal" onClick={this.purchasePremium} className="q-button button cta-button bg-orange text-white">Update Card</button>;
  }

  currentSubscription(newSub) {
    if (!this.state.subscriptionStatus || this.state.subscriptionStatus.expired) {
      return newSub;
    }
    return this.state.subscriptionStatus;
  }

  redeemPremiumCredits() {
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
  }

  updateSubscription(params, subscriptionId) {
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
  }

  updateCard() {
    this.showPaymentModal();
  }

  showPremiumConfirmationModal() {
    this.setState({ showPremiumConfirmationModal: true, });
  }

  hidePremiumConfirmationModal() {
    this.setState({ showPremiumConfirmationModal: false, });
  }

  showPaymentModal() {
    this.setState({ showPaymentModal: true, });
  }

  hidePaymentModal() {
    this.setState({ showPaymentModal: false, });
  }

  render() {
    const userHasValidSub = this.state.subscriptionStatus && !this.state.subscriptionStatus.expired;
    const subId = `${_.get(this.state.subscriptionStatus, 'subscriptionStatus.id')}-subscription-status-id`;
    return (
      <div>
        <SubscriptionStatus
          key={subId}
          subscriptionStatus={this.state.subscriptionStatus}
          trialSubscriptionTypes={this.props.trialSubscriptionTypes}
          schoolSubscriptionTypes={this.props.schoolSubscriptionTypes}
          showPaymentModal={this.showPaymentModal}
        />
        <CurrentSubscription
          showPaymentModal={this.showPaymentModal}
          purchaserNameOrEmail={this.state.purchaserNameOrEmail}
          subscriptionStatus={this.state.subscriptionStatus}
          lastFour={this.props.lastFour}
          updateSubscription={this.updateSubscription}
          currentUserIsPurchaser={this.currentUserIsPurchaser(this.state.subscriptionStatus)}
        />
        <SubscriptionHistory
          subscriptions={this.state.subscriptions}
          premiumCredits={this.props.premiumCredits}
          currentUserIsPurchaser={this.currentUserIsPurchaser}
        />
        <AvailableCredits userHasValidSub={userHasValidSub} availableCredits={this.state.availableCredits} redeemPremiumCredits={this.redeemPremiumCredits} />
        <PremiumCreditsTable
          earnedCredits={this.state.earnedCredits}
          premiumCredits={this.props.premiumCredits}
        />
        <RefundPolicy />
        <PremiumConfirmationModal show={this.state.showPremiumConfirmationModal} hideModal={this.hidePremiumConfirmationModal} subscription={this.state.subscriptionStatus} />
        <PaymentModal show={this.state.showPaymentModal} hideModal={this.hidePaymentModal} lastFour={this.props.lastFour} updateSubscriptionStatus={this.updateSubscriptionStatus} />

      </div>
    );
  }
}
