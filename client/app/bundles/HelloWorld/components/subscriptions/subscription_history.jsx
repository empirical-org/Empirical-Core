import React from 'react';
import moment from 'moment';
import pluralize from 'pluralize';

export default class extends React.Component {

  subscriptionHistoryRows() {
    const rows = [];
    this.props.subscriptions.forEach((sub) => {
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
    console.log(this.props.currentUserIsPurchaser(subscription));
    if (this.props.currentUserIsPurchaser(subscription)) {
      if (subscription.payment_amount) {
        return `$${subscription.payment_amount / 100}`;
      } else if (subscription.payment_method === 'Premium Credit') {
        return subscription.payment_method;
      }
    }
    return '--';
  }

  content() {
    const subscriptionHistoryRows = this.subscriptionHistoryRows();
    if (subscriptionHistoryRows.length > 0) {
      return (
        <table>
          <tbody>
            <tr>
              <th>Purchase Date</th>
              <th>Subscription</th>
              <th>Payment</th>
              <th>Length</th>
              <th>Start & End Date</th>
            </tr>
            {subscriptionHistoryRows}
          </tbody>
        </table>);
    }
    return (
      <div className="empty-state flex-row justify-content">
        <h3>You have not yet started a Quill Premium Subscription</h3>
        <span>Purchase Quill Premium or apply credits to get access to Premium reports.</span>
      </div>
    );
  }

  render() {
    return (
      <section className="subscription-history">
        <h2>Premium Subscription History</h2>
        {this.content()}
      </section>
    );
  }
}
