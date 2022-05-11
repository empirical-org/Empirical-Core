import React from 'react';
import request from 'request';
import Pusher from 'pusher-js';
import _ from 'lodash';

import SubscriptionStatus from '../components/subscriptions/SubscriptionStatus';
import AvailableCredits from '../components/subscriptions/available_credits';
import CurrentSubscription from '../components/subscriptions/current_subscription';
import SubscriptionHistory from '../components/subscriptions/subscription_history';
import PremiumConfirmationModal from '../components/subscriptions/PremiumConfirmationModal';
import RefundPolicy from '../components/subscriptions/refund_policy';
import PremiumCreditsTable from '../components/subscriptions/premium_credits_table';
import getAuthToken from '../components/modules/get_auth_token';
import { ACCOUNT_TYPE_TO_SUBSCRIPTION_TYPES } from '../components/subscriptions/constants';
import { requestGet } from '../../../modules/request';

export default class Subscriptions extends React.Component {
  constructor(props) {
    super(props);
    const availableAndEarnedCredits = this.availableAndEarnedCredits(props.premiumCredits);

    this.state = {
      subscriptions: props.subscriptions,
      subscriptionStatus: props.subscriptionStatus,
      availableCredits: availableAndEarnedCredits.available,
      earnedCredits: availableAndEarnedCredits.earned,
      showPremiumConfirmationModal: false,
      authorityLevel: props.userAuthorityLevel,
    };
  }

  componentDidMount() {
    this.retrieveStripePurchasedConfirmation()
    this.retrieveStripeSubscriptionPaymentMethodUpdating()
  }

  availableAndEarnedCredits(premiumCredits) {
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

    if (!subscriptionStatus || subscriptionStatus.expired) { return newSub }

    return subscriptionStatus;
  }

  retrieveStripePurchasedConfirmation = () => {
    const { stripeInvoiceId } = this.props

    if (!stripeInvoiceId) { return }

    requestGet(`/subscriptions/retrieve_stripe_subscription/${stripeInvoiceId}`, (body) => {
      if (body.quill_retrieval_processing) {
        this.initializePusherForStripePurchaseConfirmation()
      } else {
        this.updateSubscriptionStatus(body)
      }
    })
  }

  retrieveStripeSubscriptionPaymentMethodUpdating = () => {
    const { stripeInvoiceId, stripePaymentMethodUpdated } = this.props

    if (!stripeInvoiceId || !stripePaymentMethodUpdated) { return }

    requestGet(`/subscriptions/retrieve_stripe_subscription/${stripeInvoiceId}`, (body) => {
      if (body.quill_retrieval_processing) {
        this.initializePusherForStripeSubscriptionPaymentMethodUpdating()
      } else {
        this.updateSubscriptionStatus(body)
      }
    })
  }

  initializePusherForStripePurchaseConfirmation() {
    const { stripeInvoiceId } = this.props
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channelName = String(stripeInvoiceId)
    const channel = pusher.subscribe(channelName);

    channel.bind('stripe-subscription-created', () => {
      this.retrieveStripePurchasedConfirmation()
      pusher.unsubscribe(channelName)
    })
  }

  initializePusherForStripeSubscriptionPaymentMethodUpdating() {
    const { subscriptionStatus } = this.props
    const { stripe_subscription_id } = subscriptionStatus

    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channelName = String(stripe_subscription_id)
    const channel = pusher.subscribe(channelName);

    channel.bind('stripe-subscription-payment-method-updated', () => {
      this.retrieveStripeSubscriptionPaymentMethodUpdating()
      pusher.unsubscribe(channelName)
    })
  }

  hidePremiumConfirmationModal = () => {
    this.setState({ showPremiumConfirmationModal: false, });
  };

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

  showPremiumConfirmationModal = () => {
    this.setState({ showPremiumConfirmationModal: true, });
  };

  subscriptionType() {
    const { subscriptionStatus } = this.props

    if (!subscriptionStatus) { return 'Basic' }

    return ACCOUNT_TYPE_TO_SUBSCRIPTION_TYPES[subscriptionStatus.account_type]
  }

  updateSubscription = (params, subscriptionId, callback) => {
    request.put({
      url: `${process.env.DEFAULT_URL}/subscriptions/${subscriptionId}`,
      json: { subscription: params, authenticity_token: getAuthToken(), },
    }, (error, httpStatus, body) => {
      if (httpStatus.statusCode === 200) {
        this.getSubscriptionData(callback)
      } else {
        alert('There was an error updating your subscription. Please try again or contact hello@quill.org.');
      }
    });
  };

  getSubscriptionData(callback) {
    requestGet('/subscriptions', (body) => {
      const availableAndEarnedCredits = this.availableAndEarnedCredits(body.premium_credits);

      this.setState({
        subscriptions: body.subscriptions,
        subscriptionStatus: body.subscription_status,
        availableCredits: availableAndEarnedCredits.available,
        earnedCredits: availableAndEarnedCredits.earned,
        authorityLevel: body.user_authority_level,
      }, () => {
        callback ? callback() : null
      });
    })
  }

  updateSubscriptionStatus = subscription => {
    this.setState({
      showPremiumConfirmationModal: true,
      subscriptionStatus: subscription
    })
  }

  userIsContact() {
    const { subscriptionStatus, } = this.props
    if (subscriptionStatus) {
      return Number(document.getElementById('current-user-id').getAttribute('content')) === subscriptionStatus.purchaser_id;
    }
    return false;
  }

  render() {
    const { premiumCredits } = this.props

    const {
      authorityLevel,
      availableCredits,
      earnedCredits,
      showPremiumConfirmationModal,
      subscriptions,
      subscriptionStatus
    } = this.state

    const userHasValidSub = subscriptionStatus && !subscriptionStatus.expired;
    const subId = `${_.get(subscriptionStatus, 'id')}-subscription-status-id`;

    return (
      <div>
        <SubscriptionStatus
          key={subId}
          subscriptionStatus={subscriptionStatus}
          subscriptionType={this.subscriptionType()}
          userIsContact={this.userIsContact()}
        />
        <CurrentSubscription
          authorityLevel={authorityLevel}
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
        <PremiumConfirmationModal
          hideModal={this.hidePremiumConfirmationModal}
          show={showPremiumConfirmationModal}
          subscription={subscriptionStatus}
        />
      </div>
    )
  }
}
