import React from 'react';
import moment from 'moment';
import pluralize from 'pluralize';
import SubscriptionStatus from '../components/subscriptions/subscription_status';

export default class extends React.Component {

  subscriptionHistoryRows() {
    const rows = [];
    this.props.subscriptions.forEach((sub) => {
      const startD = moment(sub.start_date);
      const endD = moment(sub.expiration);
      const duration = endD.diff(startD, 'months') + 1;
      rows.push(<tr key={sub.id}>
        <td>{moment(sub.created_at).format('MMMM Do, YYYY')}</td>
        <td>{sub.account_type}</td>
        <td>{sub.account_type}</td>
        <td>{`${duration} ${pluralize('month', duration)}`}</td>
        <td>{`${startD.format('MM/DD/YY')} - ${endD.format('MM/DD/YY')}`}</td>
      </tr>);
      const matchingTransaction = this.props.premiumCredits.find(transaction => transaction.source_id === sub.id && transaction.source_type === 'Subscription');
      if (matchingTransaction) {
        rows.push(<tr className="subscription-row text-center">
          <td colSpan="5">
            Your school purchased School Premium during your subscription, so we
            credited your account with {matchingTransaction.amount} days of Teacher Premium.
          </td>
        </tr>);
      }
    });
    return rows;
  }

  subscriptionHistory() {
    return (
      <section>
        <h2>Premium Subscription History</h2>
        <table>
          <tbody>
            <tr>
              <th>Purchase Date</th>
              <th>Subscription</th>
              <th>Payment</th>
              <th>Length</th>
              <th>Start / End Date</th>
            </tr>
            {this.subscriptionHistoryRows()}
          </tbody>
        </table>
      </section>
    );
  }

  currentSubscriptionInformation() {
    return (
      <section>
        <h2>Current Subscription Information</h2>
        <div className="current-subscription-information">
          THIS NEEDS FINALIZATION
        </div>
      </section>
    );
  }

  premiumCreditsTable() {
    const creditRows = this.props.premiumCredits.map(credit => (
      <tr>
        <td>{moment(credit.created_at).format('MMMM Do, YYYY')}</td>
        <td>{credit.amount}</td>
        <td>{credit.action}</td>
      </tr>
      ));
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

  premiumCredits() {
    return (
      <section>
        <div className="flex-row space-between">
          <h2>Quill Teacher Premium Credits</h2>
          <a className="green-link" href="">How to earn more Premium credit</a>
        </div>
        <div className="available-credit flex-row vertically-centered space-between">
          <div className="credit-quantity">
            You have <span>X {`${pluralize('month', 0)} `}</span> of Teacher Premium Credit available.
          </div>
          <div>
            <button className="q-button cta-button">
              Earn Premium Credit
            </button>
          </div>
        </div>
        {this.premiumCreditsTable()}
      </section>
    );
  }

  render() {
    return (
      <div>
        <SubscriptionStatus activeSubscription={this.props.activeSubscription} trialSubscriptionTypes={this.props.trialSubscriptionTypes} schoolSubscriptionTypes={this.props.schoolSubscriptionTypes} />
        {this.currentSubscriptionInformation()}
        {this.subscriptionHistory()}
        {this.premiumCredits()}
        <h2>Refund Policy</h2>
        <p>
          If you purchase a Teacher Premium subscription, and then your school purchases a School Premium subscription, you will be refunded the remainder of your Teacher Premium as Quill Premium Credit. You can redeem your Premium Credit anytime you do not currently have an active subscription, and you will be resubscribed to Quill Premium for the amount of time you have in credit. If you would like to receive a full refund there is a grace period of 5 days from the day of the renewal.
        </p>
      </div>
    );
  }
}
