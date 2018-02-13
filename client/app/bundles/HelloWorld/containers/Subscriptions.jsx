import React from 'react';
import moment from 'moment';
import pluralize from 'pluralize';
import SubscriptionStatus from '../components/subscriptions/subscription_status';
import Stripe from '../components/modules/stripe/update_card.js';
import SelectCreditCardModal from '../components/subscriptions/select_credit_card_modal';
import PremiumRedemptionModal from '../components/subscriptions/premium_redemption_modal';
import getAuthToken from '../components/modules/get_auth_token';
import request from 'request';

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      subscriptions: this.props.subscriptions,
      subscriptionStatus: this.props.subscriptionStatus,
      availableCredits: this.props.premiumCredits.reduce((total, credit) => total + credit.amount, 0),
    };
    this.redeemPremiumCredits = this.redeemPremiumCredits.bind(this);
    this.hidePremiumRedemptionModal = this.hidePremiumRedemptionModal.bind(this);
  }

  subscriptionHistoryRows() {
    const rows = [];
    this.state.subscriptions.forEach((sub) => {
      const startD = moment(sub.start_date);
      const endD = moment(sub.expiration);
      const duration = endD.diff(startD, 'months');
      const matchingTransaction = this.props.premiumCredits.find(transaction => (transaction.source_id === sub.id && transaction.source_type === 'Subscription' && transaction.amount > 0));
      if (matchingTransaction) {
        const amountCredited = matchingTransaction.amount > 6
          ? Math.round(matchingTransaction.amount / 7)
          : 1;
        rows.push(
          <tr key={`${matchingTransaction.id}-credit-subscription-table`} className="subscription-row text-center">
            <td colSpan="5">
              Your school purchased School Premium during your subscription, so we credited your account with {`${amountCredited} ${pluralize('week', amountCredited)}`} of Teacher Premium.
            </td>
          </tr>
        );
      }
      rows.push(
        <tr key={`${sub.id}-subscription-table`}>
          <td>{moment(sub.created_at).format('MMMM Do, YYYY')}</td>
          <td>{sub.account_type}</td>
          <td>{this.paymentContent(sub)}</td>
          <td>{`${duration} ${pluralize('month', duration)}`}</td>
          <td>{`${startD.format('MM/DD/YY')} - ${endD.format('MM/DD/YY')}`}</td>
        </tr>
      );
    });
    return rows;
  }

  paymentContent(subscription) {
    const currentUserId = document.getElementById('current-user-id').getAttribute('content');
    if (subscription.contact_user_id === Number(currentUserId)) {
      if (subscription.payment_amount) {
        return `$${subscription.payment_amount / 100}`;
      } else if (subscription.payment_method === 'Premium Credit') {
        return subscription.payment_method;
      }
    }
    return '--';
  }

  subscriptionHistory() {
    const subscriptionHistoryRows = this.subscriptionHistoryRows();
    let content;
    if (subscriptionHistoryRows.length > 0) {
      content = (
        <table>
          <tbody>
            <tr>
              <th>Purchase Date</th>
              <th>Subscription</th>
              <th>Payment</th>
              <th>Length</th>
              <th>Start / End Date</th>
            </tr>
            {subscriptionHistoryRows}
          </tbody>
        </table>);
    } else {
      content = (
        <div className="empty-state flex-row justify-content">
          <h3>You have not yet started a Quill Premium Subscription</h3>
          <span>Purchase Quill Premium or apply credits to get access to Premium reports.</span>
        </div>
      );
    }
    return (
      <section className="subscription-history">
        <h2>Premium Subscription History</h2>
        {content}
      </section>
    );
  }

  currentSubscriptionContent() {
    const currSub = this.props.subscriptionStatus;
    const metaRowClassName = 'meta-info flex-row space-between';
    const buttonRowClassName = 'flex-row space-between';
    if (currSub) {
      return ({ metaRows: (
        <div className={metaRowClassName}>
          <div>
            <div>
              <span className="title">Type</span>
              <span>{currSub.account_type}</span>
            </div>
            <div>
              <span className="title">Payment Method</span>
              <span>boop</span>
            </div>
            <div>
              <span className="title">Renewal Settings</span>
              <span>boop</span>
            </div>
          </div>
          <div>
            <div>
              <span className="title">Purchaser</span>
              <span>boop</span>
            </div>
            <div>
              <span className="title">Renewal Date</span>
              <span>boop</span>
            </div>
          </div>
        </div>
        ),
        cta: (
          <div className={buttonRowClassName}>
            <a href="/" className="q-button button cta-button bg-blue">Something</a>;
          </div>
        ), });
    }
    // set a more basic state if we don't have the info
    this.updateState({ noSub: true, });
    return ({ metaRows: (
      <div className={metaRowClassName}>
        <div>
          <span className="title">Quill Basic Subscription</span>
          <span>{currSub.account_type}</span>
        </div>
        <div>
          <span className="title">Payment Method</span>
          <span>Free</span>
        </div>
      </div>
      ),
      cta: (
        <div className={buttonRowClassName}>
          <a href="/premium" className="q-button button cta-button bg-orange">Learn More About Quill Premium</a>;
          <a href="/" className="q-button button cta-button bg-blue">Download Premium PDF</a>;
        </div>
      ), });
  }

  currentSubscriptionInformation() {
    const content = this.currentSubscriptionContent();
    return (
      <section>
        <h2>Current Subscription Information</h2>
        <div className="current-subscription-information">
          {content.metaRows}
        </div>
        {content.cta}
      </section>
    );
  }

  premiumCreditsTable() {
    const creditRows = this.props.premiumCredits.map((credit) => {
      // if it is less than one week, we round up to 1
      const amountCredited = credit.amount > 6
        ? Math.round(credit.amount / 7)
        : 1;
      return (
        <tr key={`credit-${credit.id}-premium-credit-table`}>
          <td>{moment(credit.created_at).format('MMMM Do, YYYY')}</td>
          <td>{`${amountCredited} ${pluralize('week', amountCredited)}`}</td>
          <td>{credit.action}</td>
        </tr>
      );
    });
    return (
      <table>
        <tbody>
          <tr>
            <th>Date Received</th>
            <th>Amount Credited</th>
            <th>Action</th>
          </tr>
          {creditRows}
        </tbody>
      </table>
    );
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
          showPremiumRedemptionModal: true,
        });
      }
    });
  }

  availableCredits() {
    let button;
    if (this.state.availableCredits > 0) {
      button = <button onClick={this.redeemPremiumCredits} className="q-button cta-button">Redeem Premium Credits</button>;
    } else {
      button = <a href="/" className="q-button button cta-button bg-orange">Earn Premium Credits</a>;
    }
    const monthsOfCredit = Math.round((this.state.availableCredits / 30.42) * 10) / 10;
    return (
      <div className="available-credit flex-row vertically-centered space-between">
        <div className="credit-quantity">
          You have
          <span>{`${monthsOfCredit} ${pluralize('month', monthsOfCredit)} `}</span>
          of Teacher Premium Credit available.
        </div>
        {button}
      </div>
    );
  }

  premiumCredits() {
    if (!this.props.premiumCredits || this.props.premiumCredits < 1) {
      return this.availableCredits();
    }
    return (
      <section>
        <div className="flex-row space-between">
          <h2>Quill Teacher Premium Credits</h2>
          <a className="green-link" href="">How to earn more Premium credit</a>
        </div>
        {this.availableCredits()}
        {this.premiumCreditsTable()}
      </section>
    );
  }

  updateCard() {
    new Stripe();
  }

  hidePremiumRedemptionModal() {
    this.setState({ showPremiumRedemptionModal: false, });
  }

  premiumRedemptionModalIfCurrentSubscription() {
    if (this.state.subscriptionStatus) {
      return (<PremiumRedemptionModal show={this.state.showPremiumRedemptionModal} hideModal={this.hidePremiumRedemptionModal} subscription={this.state.subscriptionStatus} />);
    }
  }

  render() {
    return (
      <div>
        <button type="button" id="purchase-btn" data-toggle="modal" onClick={this.updateCard} className="btn btn-default mini-btn blue">Update Card</button>;
        <SubscriptionStatus key={`${_.get(this.state.subscriptionStatus, 'subscriptionStatus.id')}-subscription-status-id`} subscriptionStatus={this.state.subscriptionStatus} trialSubscriptionTypes={this.props.trialSubscriptionTypes} schoolSubscriptionTypes={this.props.schoolSubscriptionTypes} /> {this.currentSubscriptionInformation()}
        {this.subscriptionHistory()}
        {this.premiumCredits()}
        <h2>Refund Policy</h2>
        <p>
          If you purchase a Teacher Premium subscription, and then your school purchases a School Premium subscription, you will be refunded the remainder of your Teacher Premium as Quill Premium Credit. You can redeem your Premium Credit anytime you do not currently have an active subscription, and you will be resubscribed to Quill Premium for the amount of time you have in credit. If you would like to receive a full refund there is a grace period of 5 days from the day of the renewal.
        </p>
        {this.premiumRedemptionModalIfCurrentSubscription()}
        <SelectCreditCardModal lastFour={this.props.lastFour} />

      </div>
    );
  }
}
