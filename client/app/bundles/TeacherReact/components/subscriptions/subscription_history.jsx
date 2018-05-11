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
      const tds = [
        <td key={`${sub.id}-1-row`}>{moment(sub.created_at).format('MMMM Do, YYYY')}</td>,
        <td key={`${sub.id}-2-row`}>{sub.account_type}</td>,
        <td key={`${sub.id}-3-row`}>{this.paymentContent(sub)}</td>,
        <td key={`${sub.id}-4-row`}>{`${duration} ${pluralize('month', duration)}`}</td>,
        <td key={`${sub.id}-5-row`}>{`${startD.format('MM/DD/YY')} - ${endD.format('MM/DD/YY')}`}</td>
      ];
      if (this.props.view === 'subscriptionHistory') {
        tds.push(<td key={`${sub.id}-6-row`}><a href={`${process.env.DEFAULT_URL}/cms/subscriptions/${sub.id}/edit`}>Edit Subscription</a></td>);
      }
      rows.push(
        <tr key={`${sub.id}-subscription-table`}>{tds}</tr>
      );
    });
    return rows;
  }

  paymentContent(subscription) {
    if (this.props.authorityLevel) {
      if (subscription.payment_amount) {
        return `$${subscription.payment_amount / 100}`;
      } else if (subscription.payment_method === 'Premium Credit') {
        return subscription.payment_method;
      }
    }
    return '--';
  }

  tableHeaders() {
    const tableHeaders = ['Purchase Date', 'Subscription', 'Payment', 'Length', 'Start & End Date'];
    if (this.props.view === 'subscriptionHistory') {
      tableHeaders.push('Edit Link');
    }
    return tableHeaders.map((content, i) => <th key={`${i}-table-header`}>{content}</th>);
  }

  content() {
    const subscriptionHistoryRows = this.subscriptionHistoryRows();
    if (subscriptionHistoryRows.length > 0) {
      return (
        <table>
          <tbody>
            <tr>
              {this.tableHeaders()}
            </tr>
            {subscriptionHistoryRows}
          </tbody>
        </table>);
    }
    return (
      <div className="empty-state flex-row justify-content">
        <h3>You have not yet started a Quill Premium Subscription</h3>
        <p>Purchase Quill Premium or apply credits to get access to Premium reports.</p>
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
